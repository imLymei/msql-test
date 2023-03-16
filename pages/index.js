import { useEffect, useState, useRef } from 'react';

export default function Home() {
	// Variaves useRef para pegar inputs
	const productNameRef = useRef();
	const productPriceRef = useRef();
	const productIdToDeleteRef = useRef();
	const productIdToUpdateRef = useRef();
	const productNameToUpdateRef = useRef();
	const productPriceToUpdateRef = useRef();

	// Variavel dos produtos na database
	const [products, setProducts] = useState([]);

	// Variavel para sucesso na criacao,edicao e remocao da database
	const [created, setCreated] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [deleted, setDeleted] = useState(false);

	// Funcao para pegar os produtos na database
	async function getProducts() {
		// Cria os dados do fetch com GET = PEGAR
		const getData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		// Faz o fetch na /api/products com os dados do fetch
		const response = await fetch('http://localhost:3000/api/products', getData);
		// Converte a resposta em JSON para objeto js
		const responseJson = await response.json();

		// Atualiza a array de produtos com a resposta
		setProducts(responseJson.products);
	}

	async function addProduct() {
		// Variaveis que recebem o nome e o preco do novo produto pelos inputs
		const productName = productNameRef.current.value.trim();
		const productPrice = productPriceRef.current.value.trim();

		// Reseta os campos dos inputs
		productNameRef.current.value = '';
		productPriceRef.current.value = '';

		// Cria os dados do fetch com POST = COLOCAR/CRIAR e o body para especificar o novo item da tabela
		const postData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_name: productName,
				product_price: productPrice,
			}),
		};

		// Verifica se o nome possui 3 ou mais caracteres e se tiver cancela o pedido
		if (productName.length < 3) return;

		// Faz o Fetch com os dados de POST
		const response = await fetch('http://localhost:3000/api/products', postData);

		// Traduz os dados JSON para objeto javascript
		const responseJson = await response.json();

		// Se a mensagem enviada nao for de sucesso cancelar
		if (responseJson.response.message != 'success') return;

		// Muda a variavel created para true
		setCreated(true);

		// Atualiza a array de produtos
		const newProduct = responseJson.response.product;
		setProducts([...products, { ID: newProduct.ID, NAME: newProduct.NAME, PRICE: newProduct.PRICE }]);
		// Depois de um tempo reseta os status de criacao, atualizacao e remocao
		setTimeout(resetSuccess, 5000);
	}

	async function updateProduct() {
		// Cria variaveis com os valores dos inputs
		const productId = productIdToUpdateRef.current.value.trim();
		const productName = productNameToUpdateRef.current.value.trim();
		const productPrice = productPriceToUpdateRef.current.value.trim();

		// Limpa os campos de digitacao
		productIdToUpdateRef.current.value = '';
		productNameToUpdateRef.current.value = '';
		productPriceToUpdateRef.current.value = '';

		// Se nao tiver nenhum id cancela
		if (!productId.length) return;

		// Cria os dados do fetch com PUT = ATUALIZAR passando o id do item modificado e os novos atributos
		const updateData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_id: productId,
				product_name: productName,
				product_price: productPrice,
			}),
		};

		// Faz o fetch com os dados do PUT
		const response = await fetch('http://localhost:3000/api/products', updateData);

		// Converte os dados de JSON para objeto javascript
		const responseJson = await response.json();

		// Se a mensagem for um erro cancela
		if (responseJson.response.message != 'success') return;

		// Coloca a variavel de atualizacao como TRUE
		setUpdated(true);

		// Cria uma nova array com os produtos mudando o produto que tiver o mesmo ID que o modifica
		const newProducts = products.map((product) => {
			if (product.ID == productId) {
				product.NAME = productName;
				product.PRICE = productPrice;
			}
			return product;
		});
		// Atualiza a array de produtos
		setProducts(newProducts);

		// Depois de um tempo reseta as variavies de criacao, modificao e remocao
		setTimeout(resetSuccess, 5000);
	}

	async function deleteProduct(id) {
		// Verifica se o ID recebido nao e nulo
		if (!id) return;

		// Limpa o input
		productIdToDeleteRef.current.value = '';

		// Cria os dados do fetch com DELETE = DELETAR e o body com o id a ser deletado
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_id: id,
			}),
		};

		// Faz o fetch com os dados do DELETE
		const response = await fetch('http://localhost:3000/api/products', deleteData);

		// Traduz a resposta de JSON para objeto javascript
		const responseJson = await response.json();

		// Se receber mensagem de erro para o programa
		if (responseJson.response.message != 'success') return;

		// Coloca a variavel de remocao como TRUE
		setDeleted(true);

		// Atualiza a array dos produtos
		getProducts();

		// Depois de um tempo reseta as variaveis de adicao, atualizao e remocao
		setTimeout(resetSuccess, 5000);
	}

	function resetSuccess() {
		setUpdated(false);
		setDeleted(false);
		setCreated(false);
	}

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<main className='w-screen h-full bg-slate-900 text-white p-4'>
			<div className='flex flex-col items-center'>
				<h1 className='text-6xl h-24'>My first MySQL database</h1>
				<a href='/api/products' target='_blank' rel='noreferrer' className='text-right'>
					Data Base
				</a>
			</div>
			<div className='flex flex-col justify-center items-center m-8 gap-16'>
				<div className='w-[50%] bg-black/50 p-6 border border-white'>
					<h2 className='text-center text-2xl mb-2'>Data:</h2>
					<div className='grid grid-cols-3 items-center justify-center text-center gap-4 h-[320px]'>
						{products.map((product) => {
							return (
								<div
									key={product.ID}
									className='w-[100%] p-4 border border-white h-28 flex flex-col justify-center items-center relative'>
									<h3>Nome: {product.NAME}</h3>
									<h3>Preço: {parseFloat(product.PRICE).toFixed(2)}</h3>
									<h3 className='absolute bottom-2 right-2'>{product.ID}</h3>
								</div>
							);
						})}
					</div>
				</div>
				<form className='flex flex-col border border-white p-6 gap-4 bg-black/20 w-[50%]'>
					<h2 className='text-center text-2xl'>Adicionar tênis</h2>
					<input type='text' className='text-black p-2' placeholder='NOME' ref={productNameRef} />
					<input type='text' className='text-black p-2' placeholder='PREÇO' ref={productPriceRef} />
					<button
						type='button'
						className='bg-black/50 hover:bg-black/30 border border-white/20 p-2'
						onClick={addProduct}>
						Adicionar
					</button>
					{created ? <h4 className='text-center text-sm text-green-500'>Success!</h4> : null}
				</form>
				<form className='flex flex-col border border-white p-6 gap-4 bg-black/20 w-[50%]'>
					<h2 className='text-center text-2xl'>Atualizar tênis</h2>
					<input type='text' className='text-black p-2' placeholder='ID' ref={productIdToUpdateRef} />
					<input type='text' className='text-black p-2' placeholder='NOME' ref={productNameToUpdateRef} />
					<input type='text' className='text-black p-2' placeholder='PREÇO' ref={productPriceToUpdateRef} />
					<button
						type='button'
						className='bg-black/50 hover:bg-black/30 border border-white/20 p-2'
						onClick={updateProduct}>
						Atualizar
					</button>
					{updated ? <h4 className='text-center text-sm text-green-500'>Success!</h4> : null}
				</form>
				<form className='flex flex-col border border-white p-6 gap-4 bg-black/20 w-[50%]'>
					<h2 className='text-center text-2xl'>Remover tênis</h2>
					<input type='text' className='text-black p-2' placeholder='ID' ref={productIdToDeleteRef} />
					<button
						type='button'
						className='bg-red-700 hover:bg-red-700/70 border border-white/20 p-2'
						onClick={() => {
							deleteProduct(productIdToDeleteRef.current.value.trim());
						}}>
						Remover
					</button>
					{deleted ? <h4 className='text-center text-sm text-green-500'>Success!</h4> : null}
				</form>
			</div>
		</main>
	);
}

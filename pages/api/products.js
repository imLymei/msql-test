// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from '@/lib/db';

export default async function handler(req, res) {
	let message;

	// Se o pedido for GET = PEGAR
	if (req.method === 'GET') {
		// Executa SQL SELECT * FROM shoes = PEGAR TODOS DE (Nome da tabela)
		const products = await query({ query: 'SELECT * FROM shoes', values: [] });

		res.status(200).json({ products: products });
	}

	// Se o pedido for POST = ADICIONAR
	if (req.method === 'POST') {
		// Pega o nome e o preco do body do pedido
		const productName = req.body.product_name;
		const productPrice = req.body.product_price;

		// Executa SQL INSERT INT shoes (NAME, PRICE) VALUES (?, ?) = COLOCAR NA LISTA (Nome da Lista) (propriedade1,propriedade2,...) COM VALOR (?,?,...) | ? = Valor definido nos Values(SAO COLOCADOS EM ORDEM)
		const addProducts = await query({
			query: 'INSERT INTO shoes (NAME, PRICE) VALUES (?,?)',
			values: [productName, productPrice],
		});

		// Se o produto adicionado tiver ID (se o POST funcionar) coloca mensagem como sucesso
		if (addProducts.insertId) {
			message = 'success';
		} else {
			message = 'error';
		}

		// Salva os dados do produto em um objeto
		let product = {
			ID: addProducts.insertId,
			NAME: productName,
			PRICE: productPrice,
		};

		// Manda como resposta um response que contem uma mensagem de sucesso ou erro e o objeto do produto adicionado
		res.status(200).json({ response: { message: message, product: product } });
	}

	// Se o pedido for PUT = MODIFICAR
	if (req.method === 'PUT') {
		// Recebe os dados dos inputs
		const productId = req.body.product_id;
		const productName = req.body.product_name;
		const productPrice = req.body.product_price;

		// Executa a SQL UPDATE shoes SET NAME = ?, PRICE = ? WHERE ID = ?  = ATUALIZE (Nome da tabela) TRANSFORME (Nome do atributo1) = ?, (Nome do atributo2) = ?,... ONDE ID = ?
		const updateProducts = await query({
			query: 'UPDATE shoes SET NAME = ?, PRICE = ? WHERE ID = ?',
			values: [productName, productPrice, productId],
		});

		// Se um produto for modificado salva a linha modificada
		const result = updateProducts.affectedRows;

		// Se existir linha modificada mandar mensagem de sucesso
		if (result) {
			message = 'success';
		} else {
			message = 'error';
		}

		// Salva os dados do produto em um objeto
		const product = {
			ID: productId,
			NAME: productName,
			PRICE: productPrice,
		};

		// Retorna um response com a mensagem de erro ou sucesso e o objeto modificado
		res.status(200).json({ response: { message: message, product: product } });
	}

	// Se o pedido for DELETE = DELETAR
	if (req.method === 'DELETE') {
		//Salva o ID que deve ser deletado
		const productId = req.body.product_id;

		//Executa o SQL DELETE FROM shoes WHERE ID = ?  = DELETAR DE (nome da tabela) ONDE ID = ?
		const deleteProducts = await query({
			query: 'DELETE FROM shoes WHERE ID = ?',
			values: [productId],
		});

		// Salva a linha modificada
		const result = deleteProducts.affectedRows;

		// Se uma ilha for modificada manda mensagem de sucesso
		if (result) {
			message = 'success';
		} else {
			message = 'error';
		}

		// Retorna um response com a mensagem de sucesso ou erro e o ID do produto deletado
		res.status(200).json({ response: { message: message, product_id: productId } });
	}
}

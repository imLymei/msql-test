import mysql from 'mysql2/promise';
require('dotenv').config();

export async function query({ query, values = [] }) {
	const dbConnection = await mysql.createConnection({
		host: 'localhost',
		port: process.env.MYSQL_PORT,
		database: 'shoes',
		user: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
	});

	try {
		const [results] = await dbConnection.execute(query, values);
		dbConnection.end();
		return results;
	} catch (error) {
		throw Error(error.message);
		return { error };
	}
}

import mysql from 'mysql'

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}
    try{

    }
    catch (error) {
        response.statusCode = 400
        response.error = error
    }
    pool.end()
    return response;

}
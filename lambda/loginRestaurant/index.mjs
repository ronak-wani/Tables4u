import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let LoginRestauraunt = (password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE password = ?;", [password], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const restaurant = await LoginRestauraunt(event.password)
        response = {
            statusCode: 200,
            result:{
                "restaurant": restaurant
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
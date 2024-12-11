import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let FetchRestaurant = (name, address, tableID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants R JOIN Tables T ON R.restaurantID = T.restaurantID WHERE name = ? AND address = ? AND tableID = ?;", [name, address, tableID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const restaurant = await FetchRestaurant(event.name, event.address, event.tableID)
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
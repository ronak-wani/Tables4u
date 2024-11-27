import mysql from 'mysql';

export const handler = async (event) => {
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})
    let response = {}

    let ListRestauraunts = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT name, address FROM Restaurants WHERE isActive = 'Y'", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    
    try{
    const activeRestaurants = await ListRestauraunts()
    response = {
        statusCode: 200,
        restaurants: activeRestaurants
        
      }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }



  

pool.end()
    return response;
}
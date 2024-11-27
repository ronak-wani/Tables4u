import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let CreateRestaurant = (name, address, numberOfTables, password) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Restaurants (name, address, numberOfTables, password) VALUES (?, ?, ?, ?);", [name, address, numberOfTables, password], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const all_restaurants = await CreateRestaurant(event.name, event.address, event.numberOfTables, event.password)
        response = {
            statusCode: 200,
            result: {
                "name" : event.name,
                "address" : event.address,
                "numberOfTables" : event.numberOfTables
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }




    pool.end()
    return response;
}
import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let ActivateRestaurant = (name, address, numberOfTables, password, openHour, closeHour) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Restaurants SET isActive = 'Y', openHour = ?, closeHour = ?, numberOfTables = ? WHERE name = ? AND address = ? AND password = ?;", [openHour, closeHour, numberOfTables, name, address, password], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const all_restaurants = await ActivateRestaurant(event.name, event.address, event.numberOfTables, event.password, event.openHour, event.closeHour)
        response = {
            statusCode: 200,
            result: {
                "name" : event.name,
                "address" : event.address,
                "numberOfTables": event.numberOfTables,
                "isActive" : event.isActive,
                "openHour" : event.openHour,
                "closeHour": event.closeHour
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let identifyID = (password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT restaurantID FROM Tables4u.Restaurants WHERE password = ?;", [password], (error, idNumber) => {
                if (error) { return reject(error) }
                let output = JSON.parse(JSON.stringify(idNumber))
                return resolve(output)
            })
        })
    }
    let saveTable = (restaurantID, tableID, numberOfSeats) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Tables SET numberOfSeats = ? WHERE restaurantID = ? AND tableID = ?;", 
            [numberOfSeats, restaurantID, tableID], (error, rows) => {
                console.log('his')
                console.log(restaurantID)
                console.log(tableID)
                console.log(numberOfSeats)
                    if (error) { return reject(error); }
                    let output = JSON.parse(JSON.stringify(rows))
                    return resolve(output);
                })
        })
    }
    try {
        const restaurantID = await identifyID(event.password)
        console.log('id')
        console.log(restaurantID[0].restaurantID)
        const tableResponse = await saveTable(restaurantID[0].restaurantID, event.tableID, event.numberOfSeats);
        console.log('output')
        console.log(tableResponse)
        const response = {
            statusCode: 200,
            restaurantID: restaurantID,
            numberOfSeats: tableResponse.numberOfSeats
        }
        return response
        
    }
    catch (err) {
        response = { statusCode: 400, error: err }
    }


    pool.end()
    return response;
}
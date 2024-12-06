import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let saveRestaurant = (numberOfTables, password, openHour, closeHour) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Restaurants SET numberOfTables = ?, openHour = ?, closeHour = ? WHERE password = ?;", [numberOfTables, openHour, closeHour, password], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            })
        })
    }
    let saveTable = (restaurantID, tableID, numberOfSeats) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Tables SET numberOfSeats = ? WHERE restaurantID = ? AND tableID = ?;", [numberOfSeats, restaurantID, tableID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    let findNumSeats = (restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT numberOfSeats FROM Tables WHERE restaurantID = ?;", [restaurantID], (error, rows) => {
                if (error) { return reject(error);}
                let output = JSON.parse(JSON.stringify(rows))
                console.log('hisssss')
                console.log(output)
                return resolve(output)
            })
        })
    }
            try{
                
                await saveRestaurant(event.numberOfTables, event.password, event.openHour, event.closeHour);
                const restaurantResponse = {
                  name: event.name,
                  address: event.address,
                  numberOfTables: event.numberOfTables,
                  isActive: event.isActive,
                  openHour: event.openHour,
                  closeHour: event.closeHour,
                };
            
                // Call saveTable
                await saveTable(event.restaurantID, event.tableID, event.numberOfSeats);
                const tableResponse = {
                  restaurantID: event.restaurantID,
                  tableID: event.tableID,
                  numberOfSeats: event.numberOfSeats,
                };
                const numSeatsOut = await findNumSeats(event.restaurantID);
                console.log(numSeatsOut)
                // Consolidate responses
                response = {
                  statusCode: 200,
                  result: {
                    restaurant: restaurantResponse,
                    table: tableResponse,
                    numSeats: numSeatsOut
                  },
                };
            }
            catch(err) {
                response = {statusCode: 400, error: err}
            }


    pool.end()
    return response;
}
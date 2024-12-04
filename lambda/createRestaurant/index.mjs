import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    });

    const createRestaurant = (name, address, numberOfTables, password) => {
        return new Promise((resolve, reject) => {
            pool.query(
                "INSERT INTO Restaurants (name, address, numberOfTables, password) VALUES (?, ?, ?, ?);",
                [name, address, numberOfTables, password],
                (error, results) => {
                    if (error) return reject(error);
                    return resolve(results.insertId);
                }
            );
        });
    };

    const createTable = (restaurantID, tableID, numberOfSeats) => {
        return new Promise((resolve, reject) => {
            pool.query(
                "INSERT INTO Tables (restaurantID, tableID, numberOfSeats) VALUES (?, ?, ?);",
                [restaurantID, tableID, numberOfSeats],
                (error, results) => {
                    if (error) return reject(error);
                    return resolve(results);
                }
            );
        });
    };

    let response = {};

    try {
        const restaurantID = await createRestaurant(event.name, event.address, 1, event.password);

        await createTable(restaurantID, 1, event.numberOfSeats);

        response = {
            statusCode: 200,
            result: {
                restaurantID: restaurantID,
                name: event.name,
                address: event.address,
                numberOfTables: 1,
                tableID: 1,
                numberOfSeats: event.numberOfSeats,
            },
        };
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
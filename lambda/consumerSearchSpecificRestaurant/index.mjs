import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let findRestaurant = (name, day, time) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT name, address FROM Restaurants WHERE name = ? AND isActive = 'Y';", [name], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            })
        })
    }
    try {
        const restaurantDetails = await findRestaurant(event.name, event.day, event.time);
        if (restaurantDetails.length === 0) {
            response = {
                statusCode: 404,
                error: "Restaurant not found",
            };
        } else {
            const { name, address } = restaurantDetails[0];

            response = {
                statusCode: 200,
                result: {
                    name: name,
                    address: address,
                    day: event.day,
                    time: event.time,
                },
            };
        }
    } catch (err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
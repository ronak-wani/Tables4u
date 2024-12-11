import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let findRestaurant = (day, time) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE isActive = 'Y';", [day, time], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                let output = JSON.parse(JSON.stringify(rows))
                return resolve(output);
            })
        })
    }
    try {
        const restaurantDetails = await findRestaurant(event.day, event.time);
        if (restaurantDetails.length === 0) {
            response = {
                statusCode: 404,
                error: "Restaurant not found",
            };
        } else {
            response = {
                statusCode: 200,
                result: {
                    restaurantDetails: restaurantDetails,
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
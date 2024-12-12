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
            const query = `SELECT name, address FROM Restaurants WHERE name LIKE ? AND isActive = 'Y';`
            const searchName = `%${name}%`; // Add wildcards around the name for partial matching
            pool.query(query, [searchName], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            });
        });
    };
    try {
        const restaurantDetails = await findRestaurant(event.name, event.day, event.time);
        if (restaurantDetails.length === 0) {
            response = {
                statusCode: 404,
                error: "Restaurant not found",
            };
        } else {
            const results = restaurantDetails.map(({ name, address }) => ({
                name,
                address,
                day: event.day,
                time: event.time,
            }));
            response = {
                statusCode: 200,
                results: results,
            };
        }
    } catch (err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
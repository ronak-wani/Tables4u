import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    const checkRestaurantExists = (password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT restaurantID FROM Restaurants WHERE password = ? AND isActive = 'Y';", [password], (error, results) => {
                if (error) return reject(error);
                return resolve(results[0].restaurantID);
            });
        });
    };

    const saveCloseDay = (restaurantID, day) => {
        return new Promise((resolve, reject) => {
            pool.query(
                "INSERT INTO ClosedDays (restaurantID, day) VALUES (?, ?);", [restaurantID, day], (error, results) => {
                    if (error) return reject(error);
                    return resolve(results.insertId);
                });
        });
    };

    try {

        const restaurantID = await checkRestaurantExists(event.password)
        await saveCloseDay(restaurantID, event.day);

        response = {
            statusCode: 200,
            result: {
                restaurantID: restaurantID,
                day: event.day
            },
        };
    } catch (err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}
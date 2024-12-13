import mysql from 'mysql';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

export const handler = async (event) => {
    let response = {};

    const fetchReservation = () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT tableID, numberOfSeats, confirmation, day, time, email 
                FROM Reservations 
                WHERE email = ? AND confirmation = ?`;
            pool.query(query, [event.email, event.confirmation], (error, rows) => {
                if (error) {
                    console.error("Database Error:", error);
                    return reject("Database query failed.");
                }
                if (rows.length === 0) {
                    return reject("No reservation found for the provided email and confirmation code.");
                }
                return resolve(rows[0]);
            });
        });
    };

    try {
        const reservation = await fetchReservation();
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ reservation }),
        };
    } catch (err) {
        console.error("Error Fetching Reservation:", err);
        response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: err }),
        };
    }

    return response;
};

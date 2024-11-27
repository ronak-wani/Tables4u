import mysql from 'mysql';

export const handler = async (event) => {
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})
    let response = {}

    let DeleteRestauraunt = () => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Restaurants WHERE name = ? AND address = ?;", [event.name, event.address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    if(event.adminPass === process.env.ADMIN_PASS){

    
        try{
            const deleteStatus = await DeleteRestauraunt()
            response = {
            statusCode: 200,
            success: true,
            }
        }
        catch(err) {
        response = {statusCode: 400, error: err}
        }
    }
    else {
        response = {statusCode: 400, error: "Incorrect Admin Password"}
    }

    pool.end()
    return response;
}
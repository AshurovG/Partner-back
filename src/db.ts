const Pool = require('pg').Pool
const pool = new Pool({
    user: "ashurovgeorgy",
    password: "13082003",
    host: "partner_db",
    port: 5432,
    database: "partner"
})


module.exports = pool

require('dotenv').config();

const development = {
        "username": process.env.PG_USERNAME,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DATABASE,
        "host": process.env.PG_HOST,
        "dialect": process.env.PG_DIALECT,
        "port": process.env.PG_PORT
}
const test = {
        "username": process.env.PG_USERNAME,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DATABASE,
        "host": process.env.PG_HOST,
        "dialect": "mysql"
}
const pgElephant = {
        "username": process.env.PG_USERNAME,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DATABASE,
        "host": process.env.PG_HOST,
        "dialect": "postgres",
        "port": process.env.PG_PORT
}
const pgVercel = {
        "username": process.env.PG_USERNAME,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DATABASE,
        "host": process.env.PG_HOST,
        "dialect": "postgres",
        "port": process.env.PG_PORT,
        "dialectOptions": {
          "ssl": true,
          "sslmode": "require"
        }
}

module.exports = {
        'postgresql-local': development,
        'postgresql-test': test,
        'postgresql-elephant': pgElephant,
        'postgresql-vercel': pgVercel,  
}

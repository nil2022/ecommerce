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
        "username": "root",
        "password": "",
        "database": "test",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "port": "3307"
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
        'development': development,
        'postgresql-test': test,
        'postgresql-elephant': pgElephant,
        'postgresql-vercel': pgVercel,  
}

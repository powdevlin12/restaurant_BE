const config = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    sername: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_DATABASE_NAME_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00"
  }
}

module.exports = config
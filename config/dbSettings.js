const parseBoolean = value => `${value}`.toLowerCase() === 'true';

module.exports = () => {
  const port = Number(process.env.DB_PORT || 3306);
  const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT || 60000);
  const useSsl = parseBoolean(process.env.DB_SSL || false);
  const rejectUnauthorized = parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED || false);
  const dbUsername = process.env.DB_USERNAME || process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;

  const dialectOptions = {
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    connectTimeout
  };

  if (useSsl) {
    dialectOptions.ssl = {
      require: true,
      rejectUnauthorized
    };
  }

  return {
    host: process.env.DB_HOST,
    port,
    dialect: 'mysql',
    pool: {
      max: 1000,
      min: 0,
      idle: 10000,
      acquire: connectTimeout
    },
    dialectOptions,
    replication: {
      read: [
        {
          host: process.env.DB_HOST,
          port,
          username: dbUsername,
          password: dbPassword
        }
      ],
      write: {
        host: process.env.DB_HOST,
        port,
        username: dbUsername,
        password: dbPassword
      }
    },
    logging: false
  };
};

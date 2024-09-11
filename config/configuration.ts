export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASSWORD,
  },
});

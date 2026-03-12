export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
    env: process.env.NODE_ENV || 'development',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES || '1d',
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});
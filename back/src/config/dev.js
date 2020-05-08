module.exports = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/moJPapiez',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
}

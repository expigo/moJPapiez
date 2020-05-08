module.exports = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/moJPapiez',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
}

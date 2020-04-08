const app = require('./app')
const config = require('./config/index')
const {connect} = require('./utils/db')

app.listen(config.port, async () => {
  await connect()
  console.log(`I await your orders on port ${config.port}, Captain`)
})

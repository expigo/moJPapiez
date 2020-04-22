const {Router} = require('express')
const controller = require('./user.controller')

const router = Router()

router.route('/').get(controller.getAllUsers)

module.exports = router

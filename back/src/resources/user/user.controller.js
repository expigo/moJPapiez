const User = require('./user.model')
const catchAsync = require('../../utils/catchAsync')

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

const getUser = catchAsync(async (req, res, next) => {})

module.exports = {getAllUsers}

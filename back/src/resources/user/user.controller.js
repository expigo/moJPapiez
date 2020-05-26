const User = require('./user.model')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndRemove(req.user.id, {active: false})

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.'
      )
    )
  }

  const nonChangeableFields = ['name', 'email', 'role']
  const filteredBody = filterOut(nonChangeableFields)(req.body)
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

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

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    return next(new AppError(`No user found with ID: ${req.user.id}`, 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  })
})

module.exports = {getAllUsers, deleteMe, updateMe, getUser}

// **********

function filterOut(prohibitedFields) {
  prohibitedFields =
    prohibitedFields instanceof Array ? prohibitedFields : [prohibitedFields]
  return function filterFieldsFromObj(obj) {
    return eval(`(({${prohibitedFields.join(',')}, ...o}) => o)(obj)`)
  }
}

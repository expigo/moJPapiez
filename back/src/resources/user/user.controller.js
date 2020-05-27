const User = require('./user.model')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')
const crud = require('../../utils/crud')

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

const getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

module.exports = {
  deleteMe,
  updateMe,
  getMe,
  ...crud.factory(User),
}

// **********

function filterOut(prohibitedFields) {
  prohibitedFields =
    prohibitedFields instanceof Array ? prohibitedFields : [prohibitedFields]
  /* eslint-disable-next-line */
  return function filterFieldsFromObj(obj) {
    return eval(`(({${prohibitedFields.join(',')}, ...o}) => o)(obj)`)
  }
}

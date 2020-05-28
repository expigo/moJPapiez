const bcrypt = require('bcryptjs')

const userInfo = [
  {
    _id: '5c8a1d5b0190b214360dc057',
    password: '$2a$12$Q0grHjH9PXc6SxivC8m12.2mZJ9BbKcgFpwSG4Y1ZEII8HJVzWeyS',
  },
  {
    _id: '5c8a1dfa2f8fb814b56fa181',
    password: '$2a$12$hP1h2pnNp7wgyZNRwPsOTeZuNzWBv7vHmsR3DT/OaPSUBQT.y0S..',
  },
  {
    _id: '5c8a1e1a2f8fb814b56fa182',
    password: '$2a$12$9nFqToiTmjgfFVJiQvjmreLt4k8X4gGYCETGapSZOb2hHa55t0dDq',
  },
  {
    _id: '5c8a1ec62f8fb814b56fa183',
    password: '$2a$12$tm33.M/4pfEbZF64WbFuHuVFv85v4qEhi.ik8njbud7yaoqCZpjiy',
  },
  {
    _id: '5c8a1f292f8fb814b56fa184',
    password: '$2a$12$OOPr90tBEBF1Iho3ox0Jde0O/WXUR0VLA5xdh6tWcu7qb.qOCvSg2',
  },
  {
    _id: '5c8a1f4e2f8fb814b56fa185',
    password: '$2a$12$XCXvvlhRBJ8CydKH09v1v.jpg0hB9gVVfMVEoz4MsxqL9zb5PrF42',
  },
  {
    _id: '5c8a201e2f8fb814b56fa186',
    password: '$2a$12$II1F3aBSFDF3Xz7iB4rk/.a2dogwkClMN5gGCWrRlILrG1xtJG7q6',
  },
  {
    _id: '5c8a20d32f8fb814b56fa187',
    password: '$2a$12$Jb/ILhdDV.ZpnPMu19xfe.NRh5ntE2LzNMNcsty05QWwRbmFFVMKO',
  },
  {
    _id: '5c8a211f2f8fb814b56fa188',
    password: '$2a$12$r7/jtdWtzNfrfC7zw3uS.eDJ3Bs.8qrO31ZdbMljL.lUY0TAsaAL6',
  },
  {
    _id: '5c8a21d02f8fb814b56fa189',
    password: '$2a$12$q7v9dm.S4DvqhAeBc4KwduedEDEkDe2GGFGzteW6xnHt120oRpkqm',
  },
  {
    _id: '5c8a21f22f8fb814b56fa18a',
    password: '$2a$12$lKWhzujFvQwG4m/X3mnTneOB3ib9IYETsOqQ8aN5QEWDjX6X2wJJm',
  },
  {
    _id: '5c8a22c62f8fb814b56fa18b',
    password: '$2a$12$.XIvvmznHQSa9UOI639yhe4vzHKCYO1vpTUZc4d45oiT4GOZQe1kS',
  },
  {
    _id: '5c8a23412f8fb814b56fa18c',
    password: '$2a$12$D3fyuS9ETdBBw5lOwceTMuZcDTyVq28ieeGUAanIuLMcSDz6bpfIe',
  },
  {
    _id: '5c8a23c82f8fb814b56fa18d',
    password: '$2a$12$VPYaAAOsI44uhq11WbZ5R.cHT4.fGdlI9gKJd95jmYw3.sAsmbvBq',
  },
  {
    _id: '5c8a23de2f8fb814b56fa18e',
    password: '$2a$12$l5qamwqcqC2NlgN6o5A5..9Fxzr6X.bjx/8j3a9jYUHWGOL99oXlm',
  },
  {
    _id: '5c8a24282f8fb814b56fa18f',
    password: '$2a$12$IUnwPH0MGFeMuz7g4gtfvOll.9wgLyxG.9C3TKlttfLtCQWEE6GIu',
  },
  {
    _id: '5c8a24402f8fb814b56fa190',
    password: '$2a$12$NnclhoYFNcSApoQ3ML8kk.b4B3gbpOmZJLfqska07miAnXukOgK6y',
  },
  {
    _id: '5c8a245f2f8fb814b56fa191',
    password: '$2a$12$uB5H1OxLMOqDYTuTlptAoewlovENJvjrLwzsL1wUZ6OkAIByPPBGq',
  },
  {
    _id: '5c8a24822f8fb814b56fa192',
    password: '$2a$12$11JElTatQlAFo1Obw/dwd..vuVmQyYS7MT14pkl3lRvVPjGA00G8O',
  },
  {
    _id: '5c8a24a02f8fb814b56fa193',
    password: '$2a$12$uA9FsDw63v6dkJKGlLQ/8ufYBs8euB7kqIQewyYlZXU5azEKeLEky',
  },
]
function getUser() {
  var users = []
  for (let i = 0; i < userInfo.length - 1; i++) {
    users.push({
      _id: userInfo[i]._id,
      name: `name${i}`,
      email: `halo${i}@hi.com`,
      password: userInfo[i].password,
      photo: `user-${i}.jpg`,
      role: 'user',
      active: true,
    })
  }

  users.push({
    _id: userInfo[19]._id,
    name: `name${19}`,
    email: `halo${19}@hi.com`,
    password: userInfo[19].password,
    photo: `user-${19}.jpg`,
    role: 'admin',
    active: true,
  })

  return users
}

function getIds() {
  return userInfo.map(u => u._id)
}
module.exports = {
  getIds,
  getUser,
}

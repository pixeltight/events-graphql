const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })
      if (existingUser) {
        console.log('User already exists')
        throw new Error('User already exists')
      }
      const hashedPw = await bcrypt.hash(args.userInput.password, 12)
      const user = new User({
        email: args.userInput.email,
        password: hashedPw
      })
      const result = await user.save()
      return {
        ...result._doc,
        password: null,
        _id: result.id
      }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      console.log('Password is incorrect!')
      throw new Error('Password is incorrect!')
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'always on the run',
      { expiresIn: '1h' }
    )
    return {
      userId: user.id,
      token: token,
      email: user.email,
      tokenExpiration: 1
    }
  }
}

const errorType = require('../constants/error-types')
const userService = require('../service/user.service')
const md5Password = require('../utils/password-handle')
const jwt = require('jsonwebtoken')
const { PUBLIC_KEY } = require('../app/config')

const varifyLogin = async (ctx, next) => {
  // 获取用户名密码
  const { username, password } = ctx.request.body

  // 判断用户名密码为空
  if (!username || !password) {
    const error = new Error(errorType.USERNAME_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断用户名是否存在
  let dbRes
  try {
    dbRes = await userService.getUserByName(username)
  } catch (e) {
    const error = new Error(errorType.SQL_ERROR)
    return ctx.app.emit('error', error, ctx)
  }
  if (!dbRes[0].length) {
    const error = new Error(errorType.USERNAME_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断密码和数据库中是否一致(加密)
  if (md5Password(password) !== dbRes[0][0].password) {
    const error = new Error(errorType.PASSWORD_ERROR)
    return ctx.app.emit('error', error, ctx)
  }
  ctx.user = dbRes[0][0]

  await next()
}

const varifyAuth = async (ctx, next) => {
  const Authorization = ctx.request.headers.authorization
  if (!Authorization) {
    const error = new Error(errorType.NO_TOKEN)
    return ctx.app.emit('error', error, ctx)
  }
  try {
    ctx.user = jwt.verify(Authorization, PUBLIC_KEY, { algorithms: ['RS256'] })
    await next()
  } catch {
    console.log(Authorization, '<-token解密失败')
    const error = new Error(errorType.NO_TOKEN)
    return ctx.app.emit('error', error, ctx)
  }
}

module.exports = { varifyLogin, varifyAuth }
export {}

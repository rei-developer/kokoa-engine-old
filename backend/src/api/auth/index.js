const Router = require('koa-router')
const authCtrl = require('./auth.controller')
const { isAuthenticated } = require('../../lib/user')

const app = new Router()

app.get('/check', isAuthenticated, authCtrl.getUser)
app.post('/signin', authCtrl.getAuth)
app.post('/signup', authCtrl.createUser)
app.post('/accept', authCtrl.sendMail)
app.patch('/edit/verify', authCtrl.updateUserByIsVerified)
app.patch('/edit/profile', authCtrl.updateUserByProfileImage)
app.patch('/edit', authCtrl.updateUser)

module.exports = app
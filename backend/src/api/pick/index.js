const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.post('/list', Controller.getPicks)
app.post('/write', Controller.createPick)
app.post('/vote', Controller.createPickVotes)

module.exports = app
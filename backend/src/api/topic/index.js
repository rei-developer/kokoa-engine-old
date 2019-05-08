const Router = require('koa-router')
const topicCtrl = require('./topic.controller')

const app = new Router()

app.get('/count/:domain', topicCtrl.getTopicCounts)
app.get('/boardName/:domain', topicCtrl.getBoardName)
app.get('/categories/:domain', topicCtrl.getCategories)
app.get('/read/:id', topicCtrl.getContent)
app.get('/list/widget', topicCtrl.getListToWidget)
app.post('/list', topicCtrl.getTopics)
app.post('/list/post', topicCtrl.getPosts)
app.post('/list/post/me', topicCtrl.getMyPosts)
app.post('/write', topicCtrl.createTopic)
app.post('/write/post', topicCtrl.createPost)
app.post('/vote', topicCtrl.createTopicVotes)
app.post('/vote/post', topicCtrl.createPostVotes)
app.patch('/edit/post', topicCtrl.updatePost)
app.patch('/edit/notice', topicCtrl.updateTopicByIsNotice)
app.delete('/delete', topicCtrl.deleteTopic)
app.delete('/delete/post', topicCtrl.deletePost)

module.exports = app
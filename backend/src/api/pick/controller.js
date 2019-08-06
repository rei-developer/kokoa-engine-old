const Filter = require('../../lib/filter')
const User = require('../../lib/user')
const createPick = require('../../database/pick/createPick')
const readPick = require('../../database/pick/readPick')
const updatePick = require('../../database/pick/updatePick')

module.exports.getPicks = async ctx => {
  const { ...body } = ctx.request.body
  const userId = body.userId || 0
  const searches = body.searches || { text: '', select: 0 }
  const page = body.page || 0
  const limit = body.limit || 20
  if (page < 0) return
  if (limit < 10 || limit > 50) return
  const obj = {}
  if (userId > 0) obj.userId = userId
  obj.isAllowed = 1
  const count = await readPick.count(obj)
  const picks = await readPick.picks(obj, searches, page, limit)
  ctx.body = { count, picks }
}

module.exports.createPick = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    name,
    groupname,
    pureGroupname,
    filename
  } = ctx.request.body

  console.log(filename)

  if (name === '' || groupname === '' || pureGroupname === '') return
  name = Filter.disable(name)
  groupname = Filter.disable(groupname)
  pureGroupname = Filter.disable(pureGroupname)

  await createPick({
    name,
    groupname,
    pureGroupname,
    profileImageUrl: filename
  })
  ctx.body = { status: 'ok' }
}

module.exports.createPickVotes = async ctx => {
  let { id } = ctx.request.body
  if (id < 1) return
  const pick = await readPick(id)
  if (!pick) return ctx.body = { status: 'fail' }
  const ip = ctx.get('x-real-ip')
  const date = await readPick.pickVotes(ip)
  if (date) return ctx.body = { message: '오늘은 이미 투표에 참여했습니다.', status: 'fail' }
  await createPick.createPickVotes(id, ip)
  await updatePick.updatePickByLikes(id)
  ctx.body = { status: 'ok' }
}
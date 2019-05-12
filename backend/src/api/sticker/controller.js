const moment        = require('moment')
const Status        = require('../../lib/status')
const User          = require('../../lib/user')
const createSticker = require('../../database/sticker/createSticker')
const getSticker    = require('../../database/sticker/getSticker')
const updateSticker = require('../../database/sticker/updateSticker')

module.exports.getInventoryItem = async ctx => {
  const { id } = ctx.params
  if (id < 1) return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const check = await getSticker.check(user.id, id)
  if (!check) return
  const days = moment().diff(moment(check.regdate), 'days')
  ctx.body = {
    days,
    status: 'ok'
  }
}

module.exports.getInventory = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const inventory = await getSticker.inventory(user.id)
  ctx.body = {
    inventory,
    status: 'ok'
  }
}

module.exports.getStickers = async ctx => {
  const { ...body } = ctx.request.body
  const page = body.page || 0
  const limit = body.limit || 20
  const count = await getSticker.count()
  const stickers = await getSticker.stickers(page, limit)
  ctx.body = {
    count,
    stickers,
    status: 'ok'
  }
}

module.exports.createInventoryItem = async ctx => {
  const { id } = ctx.request.body
  if (id < 1) return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const sticker = await getSticker(id)
  if (!sticker) return
  if (user.point < sticker.price) return ctx.body = Status.fail('포인트가 부족합니다.')
  const check = await getSticker.check(user.id, id)
  let date
  if (check) {
    const min = moment().diff(moment(check.regdate), 'minutes')
    date = moment(min > 0 ? new Date() : check.regdate, 'R').add(sticker.days, 'days').format('YYYY-MM-DD HH:mm:ss')
    await updateSticker.inventoryItem(user.id, id, date)
  } else {
    date = moment(new Date(), 'R').add(sticker.days, 'days').format('YYYY-MM-DD HH:mm:ss')
    await createSticker.inventoryItem(user.id, id, date)
  }
  await User.setUpPoint(user, -sticker.price)
  ctx.body = {
    date,
    status: 'ok'
  }
}
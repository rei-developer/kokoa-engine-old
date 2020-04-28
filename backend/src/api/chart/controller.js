const moment = require('moment')
const User = require('../../lib/user')
const createChart = require('../../database/chart/createChart')
const readChart = require('../../database/chart/readChart')

module.exports.votes = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    id,
    select
  } = ctx.request.body
  if (id < 1) return
  const ip = ctx.get('x-real-ip')
  const date = await readChart.voted(user.id, id, ip)
  if(user.id > 1550) {
    return ctx.body = { message: `한시적으로 신규가입자의 투표를 제한하고있습니다.`, status: 'fail' }
  }
  if (date) {
    const created = moment(date).format('YYYY/MM/DD HH:mm:ss')
    return ctx.body = { message: `이미 참여한 설문조사입니다. (${created})`, status: 'fail' }
  }
  await createChart.votes(user.id, id, select, ip)
  ctx.body = { status: 'ok' }
}
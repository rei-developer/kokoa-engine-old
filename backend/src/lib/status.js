module.exports = message => ({ message, status: 'ok' })
module.exports.fail = message => ({ message, status: 'fail' })
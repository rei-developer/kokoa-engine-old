const pool = require('..')

module.exports = async id => {
  const result = await pool.query('SELECT * FROM Stickers WHERE id = ?', [id])
  if (result.length < 1) return false
  return result[0]
}

module.exports.count = async () => {
  const result = await pool.query('SELECT COUNT(*) count FROM Stickers WHERE number > 0')
  return result[0].count
}

module.exports.stickers = async (page, limit) => {
  const result = await pool.query('SELECT * FROM Stickers WHERE number > 0 ORDER BY id DESC LIMIt ?, ?', [page * limit, limit])
  if (result.length < 1) return false
  return result
}

module.exports.check = async (userId, stickerId) => {
  const result = await pool.query('SELECT id, regdate FROM StickerInventory WHERE userId = ? AND stickerId = ?', [userId, stickerId])
  if (result.length < 1) return false
  return result[0]
}

module.exports.inventory = async userId => {
  const result = await pool.query(
    `SELECT
      si.stickerId,
      s.number,
      s.ext
    FROM StickerInventory si
    LEFT JOIN Stickers s ON s.id = si.sickerId
    WHERE si.userId = ? AND TIME_TO_SEC(TIMEDIFF(si.regdate, NOW())) > 0`,
    [userId]
  )
  if (result.length < 1) return false
  return result
}
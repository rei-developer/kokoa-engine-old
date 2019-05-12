const pool = require('..')

module.exports.inventoryItem = async (userId, stickerId, date) =>
  await pool.query('UPDATE StickerInventory SET date = ? WHERE userId = ? AND stickerId = ?', [date, userId, stickerId])
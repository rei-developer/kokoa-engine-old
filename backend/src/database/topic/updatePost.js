const pool = require('..')

module.exports = async (postId, content) => {
  await pool.query(
    `UPDATE Posts SET content = ? WHERE id = ?`,
    [content, postId]
  )
}

module.exports.updatePostCountsByLikes = async (postId, likes = 1) => {
  await pool.query(
    `UPDATE PostCounts SET likes = likes + ? WHERE postId = ?`,
    [likes, postId]
  )
}

module.exports.updatePostCountsByHates = async (postId, hates = 1) => {
  await pool.query(
    `UPDATE PostCounts SET hates = hates + ? WHERE postId = ?`,
    [hates, postId]
  )
}
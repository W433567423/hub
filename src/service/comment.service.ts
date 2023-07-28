const db = require('../app/database')

class CommentService {
  // 插入数据到数据库
  async insertComment (userId: string, momentId: string, content: string, commentId?: string) {
    if (commentId) {
      const sqlString = 'INSERT INTO comment (user_id,moment_id,comment_id,content) VALUES( ?, ?, ?, ?);'
      return (await db.execute(sqlString, [userId, momentId, commentId, content]))[0]
    } else {
      const sqlString = 'INSERT INTO comment (user_id,moment_id,content) VALUES( ?, ?, ?);'
      return (await db.execute(sqlString, [userId, momentId, content]))[0]
    }
  }

  // 修改comment by id and userId
  async getCommentByIdAndUserId (userId: string, commentId: string) {
    const sqlString = `SELECT *
                       FROM comment
                       WHERE comment.id = ?
                         AND comment.user_id = ?;
    `
    const dbRes = await db.execute(sqlString, [commentId, userId])
    return !!dbRes[0][0]
  }

  // 修改comment by id
  async changeCommentbyId (commentId: string, content: string) {
    console.log(content, commentId)
    const sqlString = 'UPDATE  comment SET content = ? WHERE id = ?;'
    return (await db.execute(sqlString, [content, commentId]))[0]
  }

  // 删除comment by id
  async delCommentById (commentId: number) {
    const sqlString = `DELETE
                       FROM comment
                       WHERE comment.id = ?;
    `
    await db.execute(sqlString, [commentId])
  }

  // 获得comments by momentId
  async getCommentsByMomentId (momentId: string) {
    const sqlString = `
      SELECT c.id,
             c.content,
             c.comment_id,
             c.createAt                                  createTime,
             JSON_OBJECT('id', u.id, 'name', u.username) publishAuthor
      FROM comment c
             LEFT JOIN USER u ON u.id = c.user_id
      WHERE c.moment_id = 1;
    `
    return (await db.execute(sqlString, [momentId]))[0]
  }
}

module.exports = new CommentService()
export {}

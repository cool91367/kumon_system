const jwt = require('jsonwebtoken');
const SECRET = require('../../config/credential/credential').jwtKey;
module.exports = async (req, res, next) => {
  try {
    // 從來自客戶端請求的 header 取得和擷取 JWT
    const token = req.header('Authorization')
    // 驗證 Token
    const decoded = jwt.verify(token, SECRET)
    // 將用戶完整資料存到 req.user 上供後續使用
    req.userInfo = decoded
    next()
  } catch (err) {
      console.log(err)
      return res.status(401).send({err: "authentication not success"})
  }
}
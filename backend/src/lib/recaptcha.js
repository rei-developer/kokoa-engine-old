const dotenv        = require('dotenv')
const axios         = require('axios')
const qs            = require('qs')


dotenv.config()

const { RECAPTCHA_KEY } = process.env


  const auth = async (token, ip) => {
    const Token = token
    const res = { success: '', score: ''}
    const url = 'https://www.google.com/recaptcha/api/siteverify'
    const opt = {
        secret: RECAPTCHA_KEY,
        response: Token,
        remoteip: ip
      }
    await axios 
    .post(url, qs.stringify(opt)
    ) .then( function(a) {
      res.success = a.data.success
      res.score = a.data.score
      console.log(res.success)
      console.log(res.score)
      if(!res.success || res.score < 0.9) {
      return false } 
      else { return true }
    })
    .catch( error => { throw error
      })
  }
   

   module.exports.authRecaptcha = async (token, ip) => { 
     try{
    await auth(token, ip) 
  } catch (e) {
    throw e
  }
}
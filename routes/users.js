var express =require('express')
var router = express.Router()
var db = require('../control/db.js')

//用户注册
router.post('/register',function(req,res,next){
  var uname = req.body.name
  var uinfo = req.body.info
  var uaccount = req.body.account
  var upassword = req.body.password
  db.insert(uaccount,upassword,uname,uinfo,res)
})

//用户登录
router.post('/login',function(req,res,next){	
  var uaccount = req.body.account
  var upassword = req.body.password
  db.login(uaccount,upassword,res)
})

//用户删除
router.get('/delete',function(req,res,next){
	var uaccount = req.query.account

	db.delUser(uaccount,res)
})

//修改密码
router.post('/update',function(req,res,next){
  var oldPwd = req.body.oldPwd;
  var newPwd = req.body.newPwd;
  var passporId = req.body.passportId;
  db.update(passporId,oldPwd,newPwd,res);
})

module.exports = router
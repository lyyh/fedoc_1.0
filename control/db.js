var mysql = require('mysql')
var async = require('async')
var status = require('../config/statusConfig')

var config = {
	host: 'localhost',
	user: 'root',
	password: '111',
	database: 'shumei_fe',
	port: 3306
}

//建立连接池
var pool = mysql.createPool(config);

//添加用户
exports.insert = function(uaccount, upassword, uname, uinfo, res) {
	pool.getConnection(function(err, connection) {
		//按顺序执行多条任务，并且下一个任务可以获取上一个任务的结果
		var tasks = [function(callback) {
			connection.beginTransaction(function(err) {
				callback(err);
			})
		}, function(callback) {
			connection.query('SELECT * FROM sys_passport WHERE u_account = ?',
				uaccount,
				function(err, result) {
					callback(err)

					if (result.length != 0) {

						res.json({
							status: status.oprErr,
							msg: '账号已经存在!'
						})
						return
					}
					
				})
		}, function(callback) {
			connection.query('INSERT INTO sys_user (u_name,u_info) values (?,?)', [uname, uinfo],
				function(err, result) {
					callback(err, result.insertId); // 生成的ID会传给下一个任务
				})
		}, function(insertId, callback) {
			connection.query('INSERT INTO sys_passport (u_account,u_password,passport_id) values (?,?,?)', [uaccount, upassword, insertId],
				function(err, result) {
					callback(err);
				});
		}, function(callback) {
			connection.commit(function(err) {
				callback(err);
			});
		}];

		async.waterfall(tasks, function(err, results) {
			if (err) {
				res.json({
					status: status.sysErr,
					msg: status.msgSysErr
				})
				connection.rollback(); // 发生错误事务回滚
			} else {
				res.json({
					status: status.oprSuccess,
					msg: '添加成功！'
				})
			}
			connection.release()
		});
	})
}

//用户登录
exports.login = function(uaccount, upassword, res) {
	var uname, uinfo

	pool.getConnection(function(err, connection) {
		var query = connection.query('SELECT * FROM sys_passport WHERE u_account = ? AND u_password = ?', [uaccount, upassword],
			function(err, result) {

				if (result == '' || result == null) {
					res.json({
						status: status.oprErr,
						msg: '账号或者密码错误'
					})
					return
				} else {
					res.json({
						status: status.oprSuccess,
						msg: '登录成功！'
					})
				}
			})
	});
}

//删除用户(根据账号)
exports.delUser = function(uaccount, res) {
	pool.getConnection(function(err, connection) {

		var tasks = [function(callback) {
			connection.beginTransaction(function(err) {
				callback(err);
			})
		}, function(callback) {
			connection.query('SELECT * FROM sys_passport WHERE u_account = ?',
				uaccount,
				function(err, result) {
					var jsonStr = JSON.stringify(result)

					if (jsonStr == '[]') {
						res.json({
							status: status.oprErr,
							msg: '账号不存在！'
						});
						return
					}

					var passportId = JSON.parse(jsonStr)[0].passport_id;

					callback(err, passportId); // 生成的ID会传给下一个任务
				})
		}, function(passportId, callback) {
			connection.query('DELETE FROM sys_user WHERE passport_id = ?',
				passportId,
				function(err, result) {
					callback(err)
				})
		}, function(callback) {
			connection.commit(function(err) {
				callback(err);
			});
		}];

		async.waterfall(tasks, function(err, results) {
			if (err) {
				res.json({
					status: status.sysErr,
					msg: status.msgSysErr
				});
				connection.rollback(); // 发生错误事务回滚
			} else {
				res.json({
					status: status.oprSuccess,
					msg: '删除成功！'
				});
			}
			connection.release();
		});
	})
}

//修改用户密码
exports.update = function(passportId, oldPwd, newPwd, res) {
	pool.getConnection(function(err, connection) {
		connection.query('UPDATE sys_passport SET u_password = ? WHERE u_password = ? AND passport_id = ?', [newPwd, oldPwd, passportId],
			function(err, result) {
				if (result.affectedRows == 0) {
					res.json({
						status: status.oprSuccess,
						msg: '修改失败！'
					})
					return
				}
				if (err) {
					res.json({
						status: status.sysErr,
						msg: err
					});
					connection.rollback();
				} else {
					res.json({
						status: status.oprSuccess,
						msg: '修改成功！'
					});
				}
				connection.release();
			})
	})
}
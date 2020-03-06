

var express = require('express');
//主要的部分start
var bodyParser = require('body-parser'); //解析,用req.body获取post参数
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var fs = require("fs");

var areaList = require('./area')
var mysql = require('mysql');

app.use(bodyParser.urlencoded({
  extended: true
}));

module.exports = {

    login : function(path,res){
        // 登录
app.post('/personLogin', function (req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html;charset=utf-8"
    })
    console.log("1111111111111111", req.body)
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'wobuzhidao123',
      database: 'study'
    });
    connection.connect();
    connection.query('select * from person_list', function (error, results, fields) {
  
      if (error) throw error;
      console.log('The user_info is: ', results);
      var temp = false
      for (var i = 0; i < results.length; i++) {
        if (req.body.first_name == results[i].username && req.body.last_name == results[i].password) {
          temp = true
        }
      }
      if (temp) {
        var data = fs.readFileSync('./奇迹.txt');
          console.log("同步读取: " + data.toString());
        res.end(JSON.stringify({
          code: 0,
          msg: "登录成功",
          data:{
            text:data.toString()
          }
        }));
      } else {
        res.end(JSON.stringify({
          code: 500,
          msg: "用户名或密码错误"
        }));
      }
  
    });
  })
    }
}
﻿//express_demo.js 文件
var express = require('express');
//主要的部分start
var bodyParser = require('body-parser'); //解析,用req.body获取post参数
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const jwt  = require('jsonwebtoken'); //生成token

let payload = {name:'张三',admin:true};
let secret = 'I_LOVE_JING';
let token = jwt.sign(payload,secret, {expiresIn:60*60*24});// 授权时效24小时})//此方法会生成一个token，第一个参数是数据，第二个参数是签名,第三个参数是token的过期时间可以不设置
console.log("------------",token)


var path = require("path")
var fs = require("fs");

var areaList = require('./area')

var requestUrl = "192.168.0.104"

// app.use(express.static(path.join(__dirname,"./static")))

app.use('/uploads',express.static('./uploads'));

app.get('/uploads/*', function (req, res) {
  console.log("{{{{{{{{{{{{{{"+ __dirname + "/" + req.url +"]]]]]]]]]]]]]]]]]]");
    res.sendFile( __dirname + "/" + req.url );
})


var mysql = require('mysql');

app.use(bodyParser.urlencoded({
  extended: true
}));

const upload=require('./router/upload.js');  //路由
app.use('/upload',upload) //路由
const msgMan=require('./router/msgMan.js');  //路由信息列表
app.use('/msgMan',msgMan) //路由信息列表


// 登录
function login () { 
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
        var data = fs.readFileSync('./static/奇迹.txt');
          console.log("同步读取]开始---------------------: \n" + data.toString() + "\n" + "同步读取结束-----------------:");
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

 login()
//注册

app.post('/register', function (req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  })
  console.log("注册前端传过来的参数", req.body)
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  connection.query('select * from person_list', function (error, results, fields) {

    if (error) throw error;
    var temp = false
    for (var i = 0; i < results.length; i++) {
      if (req.body.username == results[i].username) {
        temp = true
      }
    }
    if (temp) {
      res.end(JSON.stringify({
        code: 500,
        msg: "用户名重复"
      }));
    } else {
      var addSql = 'INSERT INTO person_list(username,password) VALUES(?,?)'; //新增语句
      var addSqlParams = [req.body.username, req.body.password];
      connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
          return;
        }
        res.end(JSON.stringify({
          code: "0",
          msg: "添加成功"
        }));
      });
    }
  });
})

app.get('/userList', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(JSON.stringify({
    code: 0,
    data: areaList,
    msg: "success"
  }));
})
//主要的部分end
app.post("/add", function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  console.log("--------", req.body);
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });
  connection.connect();
  var addSql = 'INSERT INTO user_info(name,sex,age,idcard) VALUES(?,?,?,?)'; //新增语句
  var addSqlParams = [req.body.name, req.body.sex, req.body.age, req.body.idcard];
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "添加成功"
    }));
  });
})

//主要的部分end
app.post("/updata", function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  console.log("--------", req.body);
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  var modSql = 'UPDATE user_info SET name = ?,sex = ?,age = ?,idcard = ? WHERE Id = ?';

  //   var  addSql = 'updata INTO user_info(name,sex,age,idcard) VALUES(?,?,?,?)';  //新增语句
  var addSqlParams = [req.body.name, req.body.sex, req.body.age, req.body.idcard, req.body.id];

  connection.query(modSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------INSERT----------------------------');
    //console.log('INSERT ID:',result.insertId);        
    console.log('INSERT ID:', result);
    console.log('-----------------------------------------------------------------\n\n');
    res.end(JSON.stringify({
      code: "0",
      msg: "更新成功"
    }));
  });

})
//主要的部分end
app.post("/deleteInfo", function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  }); //解决输出乱码问题
  console.log("----前端传过来的值----", req.body);
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });
  connection.connect();
  var addSql = 'delete from user_info where id=' + req.body.id; //删除语句语句
  connection.query(addSql, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "删除成功"
    }));
  });

})


var server = app.listen(8888, function () {

  var host = server.address().address
  console.log(server.address())
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s",host, port)

})
function personLogin() {
    //express_demo.js 文件
    var express = require('express');
    //主要的部分start
    var bodyParser = require('body-parser'); //解析,用req.body获取post参数
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));


    var mysql = require('mysql');

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    console.log(111111111111)

}

module.exports = {
    personLogin
}
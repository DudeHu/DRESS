define(function(req,exp,mod){
	"use strict";
	var emit = req("utils.emit");

    var service = function(uri){
        return emit(uri, "service");
    };

    mod.exports = {
        login: service("login"),                  /*登陆注册短信验证码等*/

        saveFile: service("saveFile"),            //上传文件

        _end_: 0
	};

});

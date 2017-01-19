/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";
    exp.curSpace = 0;
    exp.space = 500;
    exp.onInit = function () {
        exp.space = sessionStorage.space;
        if(exp.space.indexOf("MB")>0){
            var _s = exp.space.substr(0,exp.space.indexOf("MB"));
            exp.curSpace = 500 - Number(_s);
        }else{
            exp.curSpace = 500 - Number(exp.space);
        }
    }
    exp.exit = function () {
        sessionStorage.clear();
        exp.go("login");
    }
});
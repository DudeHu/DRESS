/**
 * Created by huyuqiong on 2016/12/16.
 */
define(function(req,exp){
    "use strict";

    exp.args = {
        password:"",
        account:""
    }
    exp.onInit = function (done) {
        done();
    }

    exp.login = function () {
        console.log(JSON.stringify(exp.args));
        exp.go("list");
    }
});
/**
 * Created by huyuqiong on 2016/12/16.
 */
define(function(req,exp){
    "use strict";

    var service = req("utils.ajax");
    exp.args = {
        password:"",
        account:""
    }
    exp.onInit = function (done) {
        if(sessionStorage.userId){
            exp.go("list");
        }else {
            done();
        }
    }

    exp.login = function () {
        service.login(exp.args,function (rs) {
            console.log(rs);
            if(rs.status == "SUCCESS"){
                sessionStorage.userId = "10001";
                sessionStorage.name = rs.data.name;
                exp.go("list");
            }else{
                $(".ui-error-con").show();
            }
        });

    }

    exp.hideError = function () {
        $(".ui-error-con").hide();
    }
});
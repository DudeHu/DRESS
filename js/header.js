/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";

    var service = req("utils.ajax");
    exp.space = 0;
    exp.onInit = function (done) {
        exp.getSpace(done);
    }

    exp.getSpace  = function (fn) {
        service.getUserInfo({userId:sessionStorage.userId},function (rs) {
            if(rs.status == "SUCCESS"){
                exp.space = Number(rs.data.space);
                fn&&fn();
            }else{
                exp.alert(rs.msg);
            }
        });
    }

    exp.exit = function () {
        sessionStorage.clear();
        exp.go("login");
    }
});
/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";
    exp.paramType = "single"
    exp.onInit = function (done) {
        if(!sessionStorage.userId){
            exp.go("login");
        }else{
            if(exp.params[0]){
                exp.page = exp.params[0];
            }
            done();
        }

    }
});
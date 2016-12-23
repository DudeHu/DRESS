/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    exp.paramType = "single"
    exp.onInit = function (done) {
        if(exp.params[0]){
            exp.page = exp.params[0];
        }
        done();
    }
});
/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    exp.onInit = function () {
        
    }

    exp.goPage = function (page) {
        exp.go("list/"+page);
    }
});
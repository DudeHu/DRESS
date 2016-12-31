/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";
    exp.args = {
        rangeVal:3,
        serachString:""
    }
    exp.rangeWidth = 0;
    exp.onInit = function () {

    }
    exp.search = function () {

    }
    exp.timeSelect = function () {
        var _ele = exp.$element;
        var _min = _ele.attr("min");
        var _max = _ele.attr("max");
        var _val = _ele.val();
        console.log(_val);
        exp.rangeWidth = (_val-_min)/(_max-_min) * 100-0.4*_val+"%";
        exp.rangePart.render();
    }
});
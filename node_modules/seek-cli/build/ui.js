/**
 * 插件
 * Created by likaituan on 15/9/18.
 */
var fs = require("fs");
var pic = require("./pic");
var {addExp} = require("./utils");

//获取JS代码
exports.getJsCode = function(list){
    var code = "";
    list.forEach(function(item){
        var mod = {};
        mod.url = `${cfg.sysPath}/ui/${item.replace("sys.ui.","")}/ui.min.js`;
        mod.code = fs.readFileSync(mod.url).toString();
        addExp(mod, "cssFile", "none");
        pic.findImage(mod);
        code += mod.code;
    });
    return code;
};

//获取CSS代码
exports.getCssCode = function(list){
    var code = "";
    list.forEach(function(item){
        var url = `${cfg.sysPath}/ui/${item.replace("sys.ui.","")}/ui.css`;
        code += fs.readFileSync(url).toString();
    });
    return code;
};

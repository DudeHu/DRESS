/**
 * seekJs配置
 * Created by likaituan on 16/8/30.
 */
var fs = require("fs");
var module = require("./module");

global.seekjs = {
    resolve: function(p){
        if(/\/$/.test(p)) {
            return module.getUrl(p, cfg.entry.url) + "/";
        }else{
            return module.getUrl(p, cfg.entry.url, true);
        }
    }
};

//添加系统命名空间子类
exports.addSubSysNs = function(){
    var items = fs.readdirSync(cfg.sysPath);
    items.forEach(function(item){
        var subPath = `${cfg.sysPath}/${item}`;
        var stat = fs.statSync(subPath);
        if(stat.isDirectory()){
            ns[`sys.${item}.`] = `${subPath}/`;
        }
    });
};

var parseCode = function (scope, code, dot="") {
    code.replace(/(\w+)\s*:\s*([^,]+)/g, function(___,c1,c2){
        //耦合度比较大,目前只有别名映射命名空间时有这种情况, 为防找不到模块,先这样写
        if(!dot && /['"](\w+(\.\w+)+)['"]/.test(c2)){
            shortMid[RegExp.$1] = c1;
        }
        scope[c1+dot] = new Function(`return ${c2}`)();
    });
};

//设置配置信息
exports.setConfig = function(entry){
    entry.code = entry.code.replace(/seekjs\.config\(\{([\s\S]+?)\}\);?/, function(_, a){
        a.replace(/(ns|alias|paths):\{([\s\S]+?)\}/ig, function(__,b1, b2){
            parseCode(global[b1], b2, b1=="ns"?".":"");
        });
        return "";
    });
};


//设置MVC路径
exports.setMVCPaths = function(entry){
    var o = pages.main = {};
    entry.code = entry.code.replace(/app\.setPath\(\{([\s\S]+?)\}\);?/g, function(_, s){
        parseCode(o, s);
        //去掉setPath中的style部分
        return _.replace(/(st|style)\s*:\s*.+?,|,\s*(st|style)\s*:\s*.+/,"");
    });
};
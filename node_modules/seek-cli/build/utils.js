/**
 * 公用函数
 * Created by likaituan on 16/8/30.
 */
var path = require("path");
var fs = require("fs");

//获取绝对路径
exports.getResolveFile = function(file, relativeFile){
    relativeFile = relativeFile || "./";
    var relativePath = path.dirname(relativeFile);
    return path.resolve(relativePath, file);
};

//添加EXP
exports.addExp = function(mod, key, val){
    var re = /[\'\"]use\s+strict[\'\"];/;
    if(!re.test(mod.code)){
        end(`${mod.mid} 未启用严格模式, 打包失败!`);
    }
    val = /^\d+$|^\s*function/.test(val) ? val: `"${val}"`;
    mod.code = mod.code.replace(re, `$&\n\texp.${key} = ${val};\n\n`);
};

//读取模块的源码
exports.readCode = function(mod){
    if(mod.code){
        log(`${mod.url}'s code is already readed!\n\n`);
        showErrStack;
    }
    var code = fs.readFileSync(mod.url).toString();
    Object.defineProperty(mod, "code", {writable:true, enumerate:false, value:code});
};
/**
 * 模块解析
 * Created by likaituan on 16/8/30.
 */

var {getResolveFile, readCode} = require("./utils");

//获取URL地址
exports.getUrl = function(mid, referUrl, js){
    if(/https?:\/\//.test(mid)){
        return mid;
    }
    if(alias[mid]){
        return alias[mid];
    }
    var url;
    for(var p in paths) {
        if(mid.indexOf(p)==0) {
            url = paths[i] + mid.replace(p, "");
            break;
        }
    }
    for(var k in ns) {
        if(mid.indexOf(k)==0) {
            url = ns[k] + mid.replace(k, "");
            break;
        }
    }
    url = url || getResolveFile(mid, referUrl);
    if(js) {
        url = /\.js$/.test(url) ? url : `${url}.js`;
    }
    return url;
};

//获取模块
exports.getMod = function(mid, referUrl, js){
    var mod = {mid, url: exports.getUrl(mid,referUrl, js)};
    readCode(mod);
    return mod;
};

//分析依赖
var isLoaded = {};
exports.parseDeps = function(mod, list){
    var referUrl = mod.url;
    if(!isLoaded[referUrl]){
        isLoaded[referUrl] = true;
        list.push(mod);

        mod.code = mod.code.replace(/(req(?:uire)?\(["'])(.+?)(['"]\);?)/g, function(_,left,mid,right){
            if(/\.css$/.test(mid)){
                var cssMod = exports.getMod(mid, referUrl);
                if(!isLoaded[cssMod.url]){
                    isLoaded[cssMod.url] = true;
                    cssList.push(cssMod);
                }
                return "";
            }else {
                mid = shortMid[mid] || mid;
                var subMod = exports.getMod(mid, referUrl, true);
                //jsList.push(subMod);
                exports.parseDeps(subMod, jsList);
                return left+mid+right;
            }
        });
    }
};



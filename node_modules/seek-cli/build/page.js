/**
 * page页面
 * Created by likaituan on 15/9/18.
 */

var fs = require("fs");
var tp = require("./h5template");
var module = require("./module");
var {addExp} = require("./utils");

/*
 //针对管钱,非常重要
 if(file=="public/templates/pay_form.html"){
 if(process.argv[2]=="online") {
 code = code.replace("payment.htm", "authpay.htm");
 console.log("\n===========正在使用生产环境连连支付===========================\n");
 }else if(process.argv[2]=="test"){
 code = code.replace("authpay.htm", "payment.htm");
 console.log("\n============正在使用测试环境连连支付==========================\n");
 }else if(process.argv[2]=="test2") {
 code = code.replace("authpay.htm", "payment.htm");
 console.log("\n============正在使用测试环境2连连支付==========================\n");
 } else{
 throw "未输入参数或参数不对";
 }
 console.log(code.replace(/\<\!\-\-.+?\-\-\>/g,"").trim()+"\n");
 }
 */

//临时,view转part
var view2part = function(tpMod, tpNs) {
    tpMod.code = tpMod.code.replace(/<div data\-view=\"(.+?)\" data\-view2part=\"true\"><\/div>/g, function (_, viewUri) {
        var subMod = module.getMod(`${tpNs}{viewuri}.html`);
        return `<div data-part="${viewUri}">${subMod.code}</div>`;
    });
};

//获取页面依赖
exports.getDeps = function(){
    for(var k in pages) {
        var mvc = pages[k];
        var dir = ns[mvc.js];
        var items = fs.readdirSync(dir);
        items.forEach(function (item) {
            var pageName = /(.+?)\.js$/i.test(item) && RegExp.$1;
            var mid = mvc.js + pageName;
            if (pageName && cfg.excludes.indexOf(mid) == -1) {
                var mod = module.getMod(mid,"",true);
                var tpMid = `${mvc.tp}${pageName}.html`;
                mod.tid = tpMid;
                var tpMod = module.getMod(tpMid);
                view2part(tpMod, mvc.tp);
                tpList.push(tpMod);
                var cssMid = `${mvc.st}${pageName}.css`;
                var cssMod = module.getMod(cssMid);
                cssList.push(cssMod);
                module.parseDeps(mod, pageList);
            }
        });
    }
};

//模板合并到JS
exports.merge = function(){
    pageList.forEach(function(mod){
        var tpMod = tpList.find(x=>x.mid==mod.tid);
        var funCode = 'function($){' + tp.getJsCode(tpMod.code) + '}';
        addExp(mod, "getTemplate", funCode);
    });
};
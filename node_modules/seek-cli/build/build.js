var startTime = Date.now();

var fs = require("fs");
var path = require("path");
var {log,end,getArgs,cmd} = require("ifun");

var fs2 = require("./fs2");
var config = require("./config");
var module = require("./module");
var page = require("./page");
var pic = require("./pic");
var ui = require("./ui");
var {readCode} = require("./utils");

var args = getArgs();

global.cfg = {
    //sysFile: "/Users/likaituan/github/seekjs/seek.js",
    sysPath: "",        //系统路径
    rootPath: process.cwd(),       //项目根路径
    index: "/Users/likaituan/wecash/projects/haiwai/2cash_admin/index.html",       //首页HTML
    dist: "/Users/likaituan/wecash/projects/haiwai/2cash_admin/dist",          //输出目录
    version: "0.0.1",
    excludes: [
        "utils.testData",
        "js.push_list",
        "js.push_send"
    ],
    uiList: ["sys.ui.mask", "sys.ui.dialog", "sys.ui.tip"]
};

global.shortMid = {};
global.alias = {};
global.ns = {};
global.paths = {};
global.pages = {};
global.jsList = [];
global.cssList = [];
global.tpList = [];
global.pageList = [];
global.imgList = [];


//Step1 - 获取系统路径和入口文件
var getSysPathAndEntryFile = function () {
    var index = {};
    index.mid = "index.html";
    console.log(cfg);
    index.url = path.resolve(cfg.rootPath, cfg.index || "./index.html");
    readCode(index);
    //cfg.rootPath = path.dirname(index.url);
    ns["root."] = `${cfg.rootPath}/`;

    //替换JS地址
    index.code = index.code.replace(/\s*src\s*=\s*\"(.*?seek\.js)\"\s*/i, function (_, sysFile) {
        sysFile = module.getUrl(cfg.sysFile || sysFile, index.url);
        cfg.sysPath = path.dirname(sysFile);
        config.addSubSysNs();
        ns["sys."] = `${cfg.sysPath}/core/`;

        return ` src="app.js?${cfg.version}"`;
    });

    //获取入口文件
    index.code.replace(/\s*data\-main\s*=\s*\"(.+)\"\s*/i, function (_, entryFile) {
        cfg.entry = module.getMod(entryFile, index.url, true);
    });
    //添加CSS链接
    index.code = index.code.replace(/<\/head>/i, `\t<link href="app.css?${cfg.version}" type="text/css" rel="stylesheet">\n</head>`);
    if (cfg.prebuild) {
        index.code = cfg.prebuild("index.html", index.code);
    }

    cfg.index = index;
};

//检查每个模块
var chkItems = function () {
    var cats = [jsList, pageList, tpList, cssList];
    cats.forEach(function (cat) {
        cat.forEach(function (mod) {
            cfg.chkModule && cfg.chkModule(mod); //step6: 前端检查
            pic.findImage(mod); //step7: 获取图片短路径
        });
    });
};

//Stepx 压缩JS文件
var compressJs = function () {
    var appJs = `${cfg.dist}/app.js`;
    log(`uglifyjs ${appJs} -o ${appJs}`);
    try {
        cmd(`uglifyjs '${appJs}' -m -o '${appJs}'`);
    } catch (e) {
        log("warn: you don't install uglify-js!");
    }
};

//存储Js
var saveJs = function () {
    var file = require.resolve("../assets/define.js");
    var code = fs.readFileSync(file).toString();
    [].concat(jsList).concat(pageList).forEach(function (mod) {
        code += mod.code.replace(/(define\()\s*(function|\{)/, `$1"${mod.mid}", $2`);
    });
    code += ui.getJsCode(cfg.uiList);
    if(!cfg.noUglify) {
        /*
        code = require(`uglify-js`).minify(code, {
            mangle: false,
            fromString: true
        }).code;
        */
    }
    saveFile("app.js", code);
    //compressJs();
};

//存储Css
var saveCss = function () {
    var code = ui.getCssCode(cfg.uiList);
    cssList.forEach(function (mod) {
        code += mod.code;
    });
    saveFile("app.css", code);
};

//检查输出目录
var chkDist = function () {
    if (!cfg.dist) {
        end("未设置dist!")
    }
    if (fs.existsSync(cfg.dist)) {
        fs2.rmdir(cfg.dist);
    }
    fs.mkdir(cfg.dist);
    return true;
};

//写入文件
var saveFile = function (fileName, code) {
    fs.writeFileSync(`${cfg.dist}/${fileName}`, code);
};


//正则处理速度更快
var getRe = function (arr) {
    var re = [];
    (arr || []).forEach(function (item) {
        item = item.replace(/\./g, "\\.").replace(/\//g, "\\/").replace(/\* /g, ".*");
        re.push(item);
    });
    re = new RegExp("^(" + (re.join("|") || ".*") + ")", "i");
    //console.log(re);
    return re;
};

exports.init = function (cfgs, args) {
    for(var k in cfgs){
        cfg[k] = cfgs[k];
    }
    for(var k2 in args){
        cfg[k2] = args[k2];
    }

    getSysPathAndEntryFile();//step1
    config.setConfig(cfg.entry);//step2: 获取模块ID配置
    config.setMVCPaths(cfg.entry);//step3: 获取MVC路径配置
    module.parseDeps(cfg.entry, jsList);//step4: 获取入口文件的依赖
    page.getDeps(); //step5: 获取所有单页的依赖
    chkItems(); //s6-s7
    cfg.show && log({alias, ns, paths, cfg, pages, jsList, pageList, tpList, cssList, imgList});
    page.merge();
    if (chkDist()) {
        saveJs(); //s8
        saveCss(); //s9
        pic.copyImage(); //s10
        saveFile("index.html", cfg.index.code);
        var endTime = Date.now();
        log(`build success!\nuse time: ${endTime - startTime}ms`);
    }
};
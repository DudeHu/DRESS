var cp = require("child_process");

//获取参数列表
exports.getArgs = function(argv, args) {
    args = args || {};
    args.more = [];

    argv.forEach(function(kv){
        kv = kv.split("=");
        var k = kv[0];
        var v = kv[1];
        if(kv.length==2){
            if(/\./.test(k)) {
                exports.parseDot(args,k.split("."),v);
            }else{
                args[k] = v;
            }
        }else if(/^\-\-(\w+)$/.test(k)){
            args[RegExp.$1] = true;
        }else if(/^\-(\w+)$/.test(k)){
            RegExp.$1.split("").forEach(function(k2){
                args[k2] = true;
            });
        }else{
            args.more.push(k);
        }
    });
    return args;
};

//解析多个.相隔开的key
exports.parseDot = function(args, kk, v){
    var k = kk.shift();
    if(kk.length>0){
        args[k] = args[k] || {};
        exports.parseDot(args[k],kk,v);
    }else{
        args[k] = v;
    }
};

//spawn封装
exports.spawn = function(cmdExp, callback) {
    var args = cmdExp;
    if(typeof args=="string") {
        args = args.split(/\s+/);
    }
    var cmd = args.shift();
    if(cmd=="npm" && process.platform=="win32"){
        cmd = "npm.cmd"
    }
    var sp = cp.spawn(cmd, args, {stdio:"inherit"});
    sp.on("data", (data)=>{
        console.log("error:",data.toString());
    });
    callback && sp.on('close', function(code){
        callback(code!==0);
    });
};


//提示
exports.log = function(message){
    console.log(message);
};

//提示并退出
exports.end = function(message){
    message && console.log(message);
    process.exit();
};
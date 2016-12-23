/**
 * Created by likaituan on 16/5/12.
 * 环境变量解析器
 */

var envList = require("../env.list.js");
var myconfig = require("../my.config.js");
var path = require("path");
var {log,end} = require("ifun");

//获取中转机列表
var getMidList = function(env, list=[]){
    var host = list[list.length] = envList[env];
    host.env = env;
    if(host.prev){
        return getMidList(host.prev, list);
    }

    var newList = {};
    list.reverse().forEach(x=>{
        newList[x.env] = x;
    });
    return newList;
};

//获取最终配置信息
exports.getEnv = function(args){
    //console.log(args);
    var nodeName = args.node || args.env || myconfig.node || "local";
    var nodeEnv = envList[nodeName];
    if(!nodeEnv){
        end(`env "${nodeName}" is not exist!`);
    }
    var node = nodeEnv.node || {};
    if(!node){
        end(`env "${nodeName}.node" is not define!`);
    }
    node.ip = node.ip || nodeEnv.ip;
    node.port = node.port || nodeEnv.port;
    node.domain = node.domain || nodeEnv.domain;
    node.host = node.domaim || node.ip;
    node.env = nodeName;
    args.cmd=="start" && console.log(`Node Is Running At ${node.ip}:${node.port} by ${nodeName}`);

    var javaName = args.java || args.env || myconfig.java || "test";

    var javaEnv = envList[javaName];
    if(!javaEnv){
        end(`env "${javaName}" is not exist!`);
    }
    var java = javaEnv.java || {};
    if(!java){
        end(`env "${javaName}.java" is not define!`);
    }
    console.log("java:"+JSON.stringify(java));
    java.ip = args.cmd=='start'&&myconfig.env=="local" ? (java.ip || javaEnv.ip) : "127.0.0.1";
    java.port = java.port || javaEnv.port;
    java.domain = java.domain || javaEnv.domain;
    java.host = java.domain || java.ip;
    args.cmd=="start" && console.log(`Java Is Running At ${java.ip}:${java.port} by ${javaName}`);

    if(args.save){
        myconfig.node = nodeName;
        myconfig.java = javaName;
        myconfig.mongo = mongoName;
        var code = JSON.stringify(myconfig, null,4);
        code = `module.exports = ${code};`;
        fs.writeFileSync("../my.config.js", code);
    }

    if(args.up){
        console.log(args.ip);
    }

    var pubEnv = envList[args.env] || {};
    var pub2 = args.pub || {};

    var pub = pubEnv.pub || pubEnv;
    pub.env = args.env;
    pub.user = pub2.user || pub.user;
    pub.ip = pub2.ip || pub.ip || pub.ips&&pub.ips.join(",") || node.ip;
    pub.port = pub2.port || args.port || pub.port || node.port;
    pub.dir = pub2.dir || pub.dir;
    pub.key = pub.prev!="pub_test" && pub.prev!="pub_pro" && pub.key;
    pub.start = {
        puber: args.puber || myconfig.author,
        env: myconfig.env || "local",
        dir: args.dir || ".",
        keyDir: args.keyDir || myconfig.keyDir
    };
    if(pub.prev && pub.prev!=myconfig.env){
        pub.mid = getMidList(pub.prev);
    }

    return {java, node, pub};
};
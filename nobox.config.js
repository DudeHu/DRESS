var env = require("./node/env");

module.exports = function (args,ua) {
    var {node,java,pub} = env.getEnv(args);

    return {
        static: {
            path: "/",
            dir: (args.bin||args.dir) ? `${__dirname}/dist/` : `${__dirname}/`
        },

        remote: {
            host: java.host,
            port: java.port,
            items:[{
                path: "/service/",
                file: require("./node/service")
            },{
                type:"json",
                path:"/node_service/",
                file:require("./node/node_service")
            }],
            validate:{
                rule: require("./node/rule"),
            },
            contentType: "json",
            headerKeys:["sessionId","adminUserId"]
        },

        onPubBefore: function(cmd){
            var branch = /^(developer|master|release)$/.test(args.currentBranch) && args.currentBranch || "developer";
            cmd(`git pull origin ${branch}`);
            cmd(`seek build ${args.env}`);
        },

        gzip: true,
        port: node.port || 3003
    }
};



var envList = module.exports = {
    //本地环境
    local: {
        ip:"127.0.0.1",
        port: 3000
    },

    test: {
        ip: "vrs-api.dressplus.cn",
        node:{
            port: 3003
        },
        java:{
            port:80
        }
    }
};
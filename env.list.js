

var envList = module.exports = {
    //本地环境
    local: {
        ip:"127.0.0.1",
        port: 3000
    },

    test: {
        ip: "dressplus-api.appdevs.cn",
        node:{
            port: 3003
        },
        java:{
            port:80
        }
    }
};
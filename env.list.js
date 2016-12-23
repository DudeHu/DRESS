//中转机器
var midHost = {
    user: "ec2-user",
    ip: "52.67.49.43",
    dir: "~",
    keyDir: "/home/ec2-user/.ssh",
    key: "san-paulo-webserver.pem"
};

//测试发版机
var testPubHost = {
    user: "ubuntu",
    ip: "52.67.130.92",
    key: "sanpaulo-test-kaku.pem",
    dir: "/data/git/fegroup/2cash_admin",
    rose: "pack"
};

//生产发版机
var proPubHost = {
    user: "ubuntu",
    ip: "10.10.35.230",
    key: "san-paulo-service.pem",
    dir: "/data/jenkins/workspace/2cash-node-admin",
    rose: "pack",
    prev: "mid"
};

var envList = module.exports = {
    //本地环境
    local: {
        ip:"127.0.0.1",
        port: 3000
    },

    /*国内测试环境*/
    dev: {
        ip:"114.215.109.132",
        java : {
            ip:"114.215.109.132",
            port: 8010
        },
        node : {
            port:3003
        },
        pub:{
            dir: "/data/2Cash/front-service"
        }
    },

    //巴西测试服务器
    test: {
        ip: "52.67.118.137",
        node:{
            port: 3003
        },
        java:{
            //ip: "52.67.118.137",
            ip:"127.0.0.1",
            port:8010
        },
        mongo: {
            dbName: "wecash",
            userName:"wecash",
            password:"hV1l0Sol"
        },
        pub:{
            user: "ubuntu",
            key: "sanpaulo-test-kaku.pem"
            // ip: "10.11.1.115",
            // prev: "pub_test"
        }
    },

    //巴西生产
    pro:{
        domain: "admin.2cash.com.br",
        https: true,
        java: {
            domain:"internal-kaku2cash-java-admin-418547695.sa-east-1.elb.amazonaws.com",
            port:8010
        },
        node:{
            port: 3003,
            port2: 80
        },
        pub: {
            ips: [

                "10.10.7.140",
                "10.10.8.170"
            ],
            user: "ubuntu",
            key: "san-paulo-webserver.pem",
            prev: "pub_pro"
        }
    },

    yumiao:{
        ip: "192.168.2.94",
        port:8090
    },

    bihai:{
        ip: "172.16.21.253",
        port: 8010
    },

    shuwei:{
        ip:"172.16.19.251",
        port: 8010
    },

    yang:{
        ip:"192.168.5.161",
        port: 8010
    },

    mid: midHost,
    pub_test: testPubHost,
    pub_pro: proPubHost
};
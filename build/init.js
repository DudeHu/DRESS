/**
 * Created by likaituan on 16/10/24.
 */

var fs = require("fs");
var {cmd} = require("ifun");

var add_my_config = function(){
    cmd("mkdir dist");
    fs.writeFileSync("my.config.js", `
    module.exports = {
        node: "local",
        java: "test",
        mongodb: "test",
        env: "local",
        keyDir: "/wecash/haiwai/pem"
    };
    `);
    console.log("add my.config.js success!");
};

add_my_config();
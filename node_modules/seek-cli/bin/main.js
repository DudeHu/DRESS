var cp = require("child_process");

module.exports = {
   get path(){
	   return cp.execSync("echo `npm root -g`").toString().replace(/\n/g,"") + "/seekjs/";
   },
   get url(){
	   return this.path + "seek.js";
   }
};

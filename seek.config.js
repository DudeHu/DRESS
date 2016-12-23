module.exports = {
    index: "./index.html",
    dist: "./dist",
    excludes: [
        "utils.testData",
        "js.push_list",
        "js.push_send"
    ],
    chkModule: function(mod){
        if(mod.mid=="utils.emit") {
            mod.code = mod.code.replace('req("utils.testData")','{}');
        }
    }
};
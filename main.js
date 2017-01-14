seekjs.config({
    ns:{
        utils: seekjs.resolve("./utils/"),
        js: seekjs.resolve("./js/"),
        tp: seekjs.resolve("./templates/"),
        st: seekjs.resolve("./css/"),
		bower:seekjs.resolve("./bower_components/plupload/js/")
    },
    alias:{
        ajax: seekjs.resolve("./utils/ajax"),
		jquery: seekjs.resolve("sys.lib.jquery"),
    }
});

define(function(req,exp,mod){
	"use strict";

	req("st.reset.css");


	var app = req("sys.app");
	var config = req("root.config");

	config.ajaxSetup();
	app.viewEx = req("utils.viewEx");
	app.filterEx = req("utils.filter");
    app.usePlugin("sys.ui.dialog");
	app.setPath({
		js: "js.",
		tp: "tp.",
		st: 'st.'
	});

	app.init("login");
});

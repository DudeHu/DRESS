define(function(req,exp){
	var app = req("sys.app");

	exp.alert = function(){
		var args = [].slice.call(arguments);
		app.plugin.dialog.alert.apply(null,args);
	};

});

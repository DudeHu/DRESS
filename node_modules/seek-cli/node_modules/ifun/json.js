module.exports = {
    parse: function(jsonStr){
        return new Function(`return ${jsonStr}`)();
    },
    format: function(json){
        if(Array.isArray(json)){
            return this.formatArr(json);
        }else if(typeof json=="object"){
            return this.formatObj(json);
        }else if(typeof json=="string"){
            return `"${json}"`;
        }else{
            return json;
        }
    },
    formatObj: function(obj){
        var a = [];
        for(var k in obj){
            if(obj.hasOwnProperty(k)) {
                a.push(`"${k}":${this.format(obj[k])}`);
            }
        }
        return `{` + a.join(", ") + `}`;
    },
    formatArr: function(arr){
        return `[` + arr.map(x=>this.format(x)).join(",\n\t") + `]`;
    }
};
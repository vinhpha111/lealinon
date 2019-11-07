var xss = require("xss");
let functions = {
    htmlFilter : function(html, newOption = {}) {
        return html;
        // let options = {
        // };
        // options = Object.assign(options, newOption);
        // let myxss = new xss.FilterXSS(options);
        // return myxss.process(html)
    }
}

module.exports = () => {
    return (req, res, next) => {
        for(let key in functions) {
            req[key] = functions[key];
        }
        next();
    }
}
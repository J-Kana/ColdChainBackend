const fs = require('fs');
const json = fs.readFileSync(__dirname + '/translations.json');
let translation = JSON.parse(json);

exports.language = (lang, value) => {
    if(lang === 'EN' || lang === 'RU' || lang ==='KZ') {
        if(translation[lang][`${value}`] === undefined) {
            return value
        }
        return translation[lang][`${value}`]
    }
    else {
        if(translation[lang][`${value}`] === undefined) {
            return value
        }
        return translation[lang][`${value}`]
    }
};

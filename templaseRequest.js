var rp = require('request-promise');

let request = async (body, token, url) => {
    try {
        var options = {
            method: 'POST',
            uri: `${process.env.HOST_HTTP}${url}`,
            body:  body,
            strictSSL: false,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token.token}`,
            },
            json: true // Automatically stringifies the body to JSON
        };

        let resBody = await rp(options)
        return resBody;
    }
    catch (err) {
        return err;
    }
}

module.exports.request = request
var whitelist = ['http://localhost:3000']
var corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
         else {
            callback(new Error('Not allowed by CORS'))
        }
        callback(null, true)

    }
}
module.exports = corsOptions

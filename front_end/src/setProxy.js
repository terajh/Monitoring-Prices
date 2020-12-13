const proxy = require('http-proxy-middleware');
const getHost = require('../../back_end/lib/host');
module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: getHost()
        }),
        proxy('/auth', {
            target: getHost()
        })
    )
}

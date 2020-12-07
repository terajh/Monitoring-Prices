const proxy = require('http-proxy-middleware');
const getHost = require('../../back_end/lib/host');
module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: 'http://localhost:3001/'
        }),
        proxy('/auth', {
            target: 'http://localhost:3001/'
        })
    )
}
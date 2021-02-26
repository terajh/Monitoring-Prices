const { get } = require("request");

const host = 'http://localhost:3001'
const destrib_host = 'http://terajoo.tk:3001'

const bgetHost = () => {
    return destrib_host;
}

module.exports = bgetHost;

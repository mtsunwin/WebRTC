const fs = require('fs')

module.exports = (app) => {
    app.route('/chat-ws')
        .get((req, response) => {
            fs.readFile('./public/chat-ws.html', function (err, html) {
                if (err) throw err;
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write(html);
                response.end();
            })
        })
    app.route('/chat')
        .get((req, response) => {
            fs.readFile('./public/chat.html', function (err, html) {
                if (err) throw err;
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write(html);
                response.end();
            })
        })
}   
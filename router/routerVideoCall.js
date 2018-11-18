const fs = require('fs')

module.exports = (app) => {
    app.route('/videocall')
        .get((req, response) => {
            fs.readFile('./public/videocall.html', function (err, html) {
                if (err) throw err;
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write(html);
                response.end();
            })
        })
}   
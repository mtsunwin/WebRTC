const fs = require('fs')

module.exports = (app) => {
    app.route('/')
        .get((req, res) => {
            fs.readFile('../public/index.html', function (err, html) {
                if (err) throw err;
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write(html);
                response.end();
            })
        })
}   
const express = require('express'),
    app = express(),
    http = require("http");

const PORT = 3000;
app.use(express.static('public'));
app.set('PORT', process.env.PORT || PORT)

var server = http.createServer(app)
server.listen(app.get("PORT"), () => {
    console.log("PORT ", app.get("PORT"))
})

const routeChat = require('./router/routerChat')
const routeIndex = require('./router/routerIndex')
const routeVideoCall = require('./router/routerVideoCall')

routeChat(app)
routeIndex(app)
routeVideoCall(app)

app.route('/thangtm')
    .get((req, response) => {
        fs.readFile('./public/thangtm/index.html', function (err, html) {
            if (err) throw err;
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        })
    })

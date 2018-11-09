const path = require('path'),
    fs = require('fs'),
    express = require('express'),
    app = express();

const PORT = 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    fs.readFile('./public/index.html', function (err, html) {
        if (err) throw err;
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    })
})

app.get('/chat', (req, response) => {
    fs.readFile('./public/chat.html', function (err, html) {
        if (err) throw err;
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    })
})


app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
const path = require('path'),
    fs = require('fs'),
    express = require('express'),
    app = express();

const PORT = 3000;
app.use(express.static('public'));
app.set('PORT', process.env.PORT || PORT)
app.listen(app.get('PORT'), () => console.log(`App listening on port ${app.get("PORT")}!`));


const routeChat = require('./router/routerChat')
const routeIndex = require('./router/routerIndex')
const routeVideoCall = require('./router/routerVideoCall')

routeChat(app)
routeIndex(app)
routeVideoCall(app)



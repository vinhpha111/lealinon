// var proxy = require('redbird')({port: 80});
// proxy.register("test.local", "http://127.0.0.1:3000");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var path = require('path');
var auth = require('./controller/middleware/authController');
var apiRoute = require('./route/api');
var webRoute = require('./route/web');
// var io = require('socket.io')(http);
global.io = require('./socket')(http)
require('dotenv').config();

global.mongoose = require('mongoose');
mongoose.connect('mongodb+srv://vinhpha:vinhpha111@cluster0-2i0en.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected database');
});

for (const key in helpers = require('./helper')) {
    if (helpers.hasOwnProperty(key)) {
        const func = helpers[key];
        global[key] = func;
    }
}

// mail
var nodemailer = require('nodemailer');
global.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinhpha111@gmail.com',
    pass: 'vinhpha112013'
  }
});
// end

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'asset')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/datetime-picker', express.static(__dirname + '/node_modules/bootstrap-ui-datetime-picker/dist/'));

// view engine setup
app.engine('html', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');

app.locals.base_url = (url) => {
    return process.env.BASE_URL+(url ? '/'+url : '');
}

app.set('trust proxy', 1) // trust first proxy

app.use(session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        httpOnly: true
    }
}));
app.use(cookieParser());
app.use(flash());

app.use('/api', auth);
app.use('/api', apiRoute);

app.use('/', webRoute);

http.listen(3000, () => {
    console.log('listening on port 3000');
});
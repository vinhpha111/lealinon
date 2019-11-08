var app = {}
var jwt = require('jsonwebtoken');
var model = require('../model');
var User = model.getInstance('users');
const {validationResult} = require('express-validator');
datetime = require('node-datetime');
var pastDateTime = datetime.create();
app.get_login = (req, res) => {
    res.render('index', {
        layout : 'user/login.html',
        errors : req.flash('errors'),
        old_data : req.flash('old_data')[0],
	})
}

app.post_login = async (req, res) => {
    var user = await User.findOne({email: req.body.email}, ['_id', 'email', 'encrypt_password']);
    console.log(user);
    if (user) {
        var check_pass = await User.checkEncrypt(req.body.password, user.encrypt_password);
        if (check_pass) {
            var token = jwt.sign({
                _id: user._id,
                email : req.body.email
            },  process.env.TOKEN_CLIENT_PRIVATE, { expiresIn: 60*60*24*30 })
            req.session.token = token;
            res.cookie('refresh_token', token, {httpOnly : true, maxAge: 1000*60*60*24*30});
            return res.redirect(base_url());
        }
        req.flash('errors', [{msg: 'mật khẩu chưa đúng!'}]);
        req.flash('old_data', req.body);
        return res.redirect('/login');
    }
    req.flash('errors', [{msg: 'Người dùng chưa tồn tại!'}]);
    req.flash('old_data', req.body);
    return res.redirect('/login');
    
}

app.get_register = (req, res) => {
    res.render('index', {
        layout : 'user/register.html',
        errors : req.flash('errors'),
        old_data : req.flash('old_data')[0],
	});
}

app.post_register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('old_data', req.body);
        console.log(req.body);
        return res.redirect('/register');
    }

    var hash = await User.generaEncrypt(req.body.password);
    let name = req.body.email.substr(0, req.body.email.indexOf('@')); 
    var user = await User.add({
        email : req.body.email,
        name: name,
        encrypt_password : hash,
        created_at : pastDateTime.now(),
    });

    var token = jwt.sign({
        id : user._id,
        email : user.email
    },  process.env.TOKEN_CLIENT_PRIVATE, { expiresIn: 60*60*24*30 })
    req.session.token = token;
    res.cookie('refresh_token', token, {httpOnly : true, maxAge: 1000*60*60*24*30});

    var activeToken = jwt.sign({
        id : user._id
    },  process.env.TOKEN_CLIENT_PRIVATE, { expiresIn: 60*60*24*7 })

    var mailOptions = {
        from: 'pha.nv@neo-lab.vn',
        to: user.email,
        subject: 'Sending Email using Node.js',
        html: '<h2>Cảm ơn đã đăng ký tài khoản! </h2>'
            +'<p>Vui lòng click vào link: '+base_url('user/active?token='+activeToken)+' để kích hoạt user.</p>'
            +'<p>P/s: Nếu không được kích hoạt trong 7 ngày user sẽ bị xóa.</p>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    console.log(user);
    res.send(user);
}

app.active = async (req, res) => {
    var token = req.query.token;
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_CLIENT_PRIVATE);
        const response = await User.update({ _id: decoded.id, active: {$ne: true} }, {active: true});
        User.schema.findById(decoded.id).exec((error, data) => console.log(data));
        if (response.nModified > 0) {
            return res.render('index', {
                layout : 'user/active_success.html'
            });
        }
        return res.redirect('/');

    } catch (error) {
        console.log('has error!');
        return res.redirect('/');
    }
}

var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID ? process.env.FACEBOOK_APP_ID : null,
    clientSecret: process.env.FACEBOOK_APP_SECRET ? process.env.FACEBOOK_APP_SECRET : null
  }, async function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    let user = User.findOrCreateFacebook(profile);
    user.then(data => done(null, data))
    .catch(err => done(err, null));
  }
));
app.login_facebook = [
    passport.initialize(),
    passport.session(),
    passport.authenticate('facebook-token', {
        session: false
    }),
    (req, res) => {
        var token = jwt.sign({
            _id: req.user._id,
            email : req.user.email
        },  process.env.TOKEN_CLIENT_PRIVATE, { expiresIn: 60*60*24*30 })
        req.session.token = token;

        return res.redirect('/');
        res.send(req.user);
    }
]

module.exports = app;
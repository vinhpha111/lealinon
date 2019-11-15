var app = {}
app.index = (req, res) => {
    res.render('app', {
        facebookAppId: process.env.FACEBOOK_APP_ID ? process.env.FACEBOOK_APP_ID : null
    })
}
module.exports = app;
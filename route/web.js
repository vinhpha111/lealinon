var express = require('express');
var route = express.Router();
var userController = require('../controller/userController');
var homeController = require('../controller/homeController');

// route.get('/login', userController.get_login);
// route.post('/login', userController.post_login);

// route.get('/register', userController.get_register);
// route.post('/register', require('../controller/Request/client/user/register'), userController.post_register);

// route.get('/user/active', userController.active);

route.get('/test-seo', (req, res) => {
    res.render('app', {
        htmlSeo: "<h1>this is page test seo</h1>"
    })
});

route.get('/sitemap', async (req, res) => {
    const { SitemapStream, streamToPromise } = require('sitemap')
    // Creates a sitemap object given the input configuration with URLs
    const sitemap = new SitemapStream({ hostname: process.env.BASE_URL });
    sitemap.write({ url: '/essay/5dc24518011cfa39a149f16d', changefreq: 'daily', priority: 0.3 })
    sitemap.end()
    
    let xml = await streamToPromise(sitemap);
    res.send(xml);
})

route.post('/login_facebook', userController.login_facebook)

route.get('/*', homeController.index);

module.exports = route;
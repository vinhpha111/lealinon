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

const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
let sitemap
route.get('/sitemap', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
        res.send(sitemap)
        return
    }
    try {
        const smStream = new SitemapStream({ hostname: process.env.BASE_URL })
        const pipeline = smStream.pipe(createGzip())
    
        smStream.write({ url: '/essay/5dc24518011cfa39a149f16d',  changefreq: 'daily', priority: 0.3 })
        smStream.end()
    
        // cache the response
        streamToPromise(pipeline).then(sm => sitemap = sm)
        // stream the response
        pipeline.pipe(res).on('error', (e) => {throw e})
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
})

route.post('/login_facebook', userController.login_facebook)

route.get('/*', homeController.index);

module.exports = route;
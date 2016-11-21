'use strict';
let bookmarks = require('./controllers/bookmarks'),
		serve = require('koa-static'),
		route = require('koa-route'),
		logger = require('koa-logger'),
		koa = require('koa'),
		path = require('path'),
		app = module.exports = koa();

app.use(logger());

app.use(route.get('/bookmarks/', bookmarks.all));
app.use(route.get('/bookmarks/:id', bookmarks.fetch));
app.use(route.post('/bookmarks/add/', bookmarks.add));
app.use(route.put('/bookmarks/:id', bookmarks.modify));
app.use(route.delete('/bookmarks/:id', bookmarks.remove));
app.use(route.options('/', bookmarks.options));
app.use(route.trace('/', bookmarks.trace));
app.use(route.head('/', bookmarks.head));


// Serve static files
app.use(serve(path.join(__dirname, '../../')));

if (!module.parent) {
  app.listen(8889);
  console.log('listening on port 8889');
}

var koa = require('koa'),
	router = require('koa-router')(),
	views = require('koa-render'),
	bodyParser = require('koa-bodyparser'),
	serve = require('koa-static'),
	oss = require('ali-oss');
const PORT = 8051;

var app =  koa();
app.use(bodyParser());

// logger with x-response-time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(views(__dirname + '/views', {
	map: {
		html: 'nunjucks'
	}
}));
app.use(serve(__dirname + '/public'));

var ossConfig = {};
router
  .get('/', function *() {
	this.body = yield this.render('login');
  })
  .post('/loginFuckingOss', function * () {
		var _this = this;
		ossConfig = _this.request.body;
		var client = oss(ossConfig);

		try {
			var result = yield client.list({
				'max-keys': 1
			});
			_this.body = yield _this.render('index');
		} catch(e) {
			_this.body = e;
		}

  });
app
  .use(router.routes())
  .use(router.allowedMethods());

// error
app.on('error', function(err){
  log.error('server error', err);
 });

app.listen(PORT);
console.log('listening on port: ', PORT);

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

var ossConfig = {}, client;
router
  .get('/', function *() {
	this.body = yield this.render('login');
  })
  .post('/loginFuckingOss', function *() {
		ossConfig = this.request.body;
		client = oss(ossConfig);

		try {
			var result = yield client.list({
				'max-keys': 1
			});
			this.body = yield this.render('index');
		} catch(e) {
			this.body = e;
		}

  })
	.post('/getFuckingList', function *() {
		var listForm = this.request.body;
		console.log(listForm);

		try {
			this.body = yield client.list(listForm);
		} catch(e) {
			console.log(e);
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

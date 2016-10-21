var koa = require('koa'),
	router = require('koa-router')(),
	views = require('koa-render'),
	bodyParser = require('koa-bodyparser'),
	serve = require('koa-static'),
	oss = require('ali-oss'),
	co = require('co');
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

router
  .get('/', function *() {
	this.body = yield this.render('login');
  })
  .post('/loginFuckingOss', function * () {
	var _this = this;
	//TODO: Login error handling
	co(function *() {
		yield *ossLogin(_this.request.body);
	}).catch(function (err) {
		console.log(err);
	});
	this.body = yield this.render('index');
  });
app
  .use(router.routes())
  .use(router.allowedMethods());

var ossConfig = {};
function *ossLogin(data) {
	ossConfig.accessKeyId = data.accessKeyId;
	ossConfig.accessKeySecret = data.accessKeySecret;
	ossConfig.region = data.region;
	ossConfig.bucket = data.bucket;
	var client = oss(ossConfig);
	var result = yield client.list({
		'max-keys': 20
	});
	console.log(result);
}
 
// error
app.on('error', function(err){
  log.error('server error', err);
 });

app.listen(PORT);
console.log('listening on port ', PORT);

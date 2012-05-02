
/**
 * Module dependencies.
 */

var express = require('express')
  , Resource = require('express-resource')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.home);

app.resource('users', require('./routes'));

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
	socket.emit('news', {msg: 'weclome ....'});

  socket.on('enter', function(data) {
    var user = data.user;
    socket.emit('msg', {
      sender: 'cici',
      body: [user, ', welcome...'].join(''),
      time: new Date()
    });
  });

	socket.on('send', function(data) {
		socket.broadcast.emit('msg', data);
	});
});

app.listen(process.env.VCAP_APP_PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

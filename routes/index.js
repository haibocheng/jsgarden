
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('index', { title: 'JS Garden' })
};

/*
	REST-ful Resource
*/
exports.index = function(req, res){
  res.send('forum index');
};

exports.new = function(req, res){
  res.send('new forum');
};

exports.create = function(req, res){
  console.log("post create method");
};

exports.show = function(req, res){
  console.log("get show method");
  res.send({name: 'haha', email: 'haha@haha.com'});
};

exports.edit = function(req, res){
  console.log("get edit method");
};

exports.update = function(req, res){
  console.log("put update method");
};

exports.destroy = function(req, res){
  console.log("delete destroy method");
};
var _          = require("underscore");
var sys        = require("sys");
var request    = require("request");
var select     = require('soupselect').select;
var htmlparser = require("htmlparser");
var puts       = sys.puts;
// internal
var posts      = require("./posts")

exports.Grab = function(board, checktime, callback) {
  setInterval(function () {
    request({uri: "http://boards.4chan.org"+board}, function (error, response, body) {
      if (error) throw error;
      var parser = new htmlparser.Parser(new htmlparser.DefaultHandler(function(err, dom) {
        if (err) throw err;      
        var as = _.map(_.select(select(dom,'a'), function (a){return (a.children && a.children[0].raw=="Reply")}), function (a){return a.attribs.href});
        _.each(as, function (url) {
          posts.Grab(board+url, function (post) {
            callback({ board: board, url: url, posts: post, threadid: _.last(url.split("/")) });
          });
        });
      })).parseComplete(body);
    });
  }, checktime*1000);
};
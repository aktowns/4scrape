var _          = require("underscore");
var sys        = require("sys");
var request    = require("request");
var select     = require('soupselect').select;
var htmlparser = require("htmlparser");
var puts       = sys.puts;

exports.Grab = function (posturl, callback) {
  puts("Scraping: http://boards.4chan.org"+posturl);
  request({uri: "http://boards.4chan.org"+posturl}, function (error, response, body) {
    if (error) throw error;
    var parser = new htmlparser.Parser(new htmlparser.DefaultHandler(function(err, dom) {
      if (err) throw err;      
      var eatchildren = function (els) {
        return _.flatten(_.map(els, function (el) {
          if (el.type == "tag") return eatchildren(el.children);
          else return el.raw
        })).join(" ");
      };
      var strip = function (str) { return str.replace(/&nbsp;/g,'').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); }
      var raw_posts = select(dom, 'td.reply');
      var posts = _.map(raw_posts, function (post) {
        var maybeImage = _.first(_.select(select(post, 'a'), function (el) {return (el.attribs.href.search(/images\.4chan/gi) > 0)}));
        var imageurl = maybeImage ? maybeImage.attribs.href : null;
        
        return {
          owner: _.last(posturl.split("/")),
          id: post.attribs.id,
          date: strip(_.map(_.select(post.children, function(el) { return el.type == "text" }), function (el) {return el.raw}).join(" ")),
          title: eatchildren(select(post, 'span.replytitle')),
          imageurl: imageurl,
          poster: eatchildren(select(post, 'span.commentpostername')),
          text: eatchildren(select(post, 'blockquote')),
          image: null,
          op: false
        };
      });
      // Add OP
      OP = {
        owner: _.last(posturl.split("/")),
        id: select(dom, 'a.quotejs').raw,
        date: null, // ehh cbf atm
        title: eatchildren(select(dom, 'span.filetitle')),
        imageurl: null,
        poster: eatchildren(select(dom, 'span.postername')),
        text: eatchildren(_.first(select(dom, 'blockquote'))),
        image: null,
        op: true
      };
      posts.splice(0,0,OP);
      
      // Kick off image downloader, we'll return when we're done. is this bad practice?
      // Basically chaining the next download, this isn't async but thats probably a good thing..
      downloadchain = function (s, loc) {
        var obj = s[loc];
        if (obj.imageurl == null)
          (s.length-1 == loc) ? callback(posts) : downloadchain(s, loc+1);
        else
          request({uri: obj.imageurl}, function (error, response, body) {
            obj.image = body;
            (s.length-1 == loc) ? callback(posts) : downloadchain(s, loc+1);
          });
      };
      downloadchain(posts, 0);
    })).parseComplete(body);
  });
}
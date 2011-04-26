#!/usr/local/bin/node
// Internal deps
var board   = require("./board");
// External deps
var _       = require("underscore");
var sys     = require("sys");
var mongo   = require("mongodb")

var boards = ["/b/", "/soc/"];
var client = new mongo.Db('4scrape', new mongo.Server('127.0.0.1', 27017, {}));

_.each(boards, function (chan) {
  // updates boards every 30 seconds
  board.Grab(chan, 30, function (posts) {
    inserta = function(err, col) {
      col.update({threadid: posts.threadid}, {$set: {posts: posts.posts}}, {upsert: true, safe: true}, function (err) {
        if (err) sys.puts("Error upserting: "+posts.threadid);
        else sys.puts("Updated: "posts.threadid);
      }); 
    };
    client.open(function(err, p_client) { client.collection('newposts', inserta); });
  });
});
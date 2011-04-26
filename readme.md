run with ./4scrape.js

tweak values, stores everything in a mongodb instance running locally
mongo isn't storing, as i need it to use gridstore

uses:
  [node-mongodb-native](https://github.com/christkv/node-mongodb-native)
  [node-htmlparser](https://github.com/tautologistics/node-htmlparser)
  [node-soupselect](https://github.com/harryf/node-soupselect)
  [underscore](http://documentcloud.github.com/underscore/)

Scrapes 4chan frontpages, storing all the content like the following:


    { board: '/b/',
      url: 'res/325093338',
      posts: 
       [ { owner: '325093338',
           id: undefined,
           date: null,
           title: '',
           imageurl: null,
           poster: 'Anonymous',
           text: '    ',
           image: null,
           op: true },
         { owner: '325093338',
           id: '325093590',
           date: '04/26/11(Tue)02:30:59',
           title: '',
           imageurl: null,
           poster: 'Anonymous',
           text: 'Seriously baby..I miss you so much. I cant stand another day apart    if dubs&#44; will be your next response.',
           image: null,
           op: false },
           ...
        ]
    }

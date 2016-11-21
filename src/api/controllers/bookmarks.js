'use strict';
let parse = require('co-body'),
    monk = require('monk'),
    wrap = require('co-monk'),
    db = monk('127.0.0.1:27017/test'),
    co = require('co');

let bookmarks = wrap(db.get('bookmarks'));

// From lifeofjs
co(function * () {
  let bookmarks = yield bookmarks.find({});
});

module.exports.all = function * all(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield bookmarks.find({});
};

module.exports.fetch = function * fetch(id,next) {
  if ('GET' != this.method) return yield next;
  // Quick hack.
  if(id === ""+parseInt(id, 10)){
    let bookmark = yield bookmarks.find({}, {
      'skip': id - 1,
      'limit': 1
    });

    if (bookmark.length === 0) {
      this.throw(404, 'bookmark with id = ' + id + ' was not found');
    }
    this.body = yield bookmark;
  }
};

module.exports.add = function * add(data,next) {
  if ('POST' != this.method) return yield next;
  let bookmark = yield parse(this, {
    limit: '1kb'
  });

  let inserted = yield bookmarks.insert(bookmark);
  if (!inserted) {
    this.throw(405, "The bookmark couldn't be added.");
  }
  this.body = 'Done!';
};

module.exports.modify = function * modify(id,next) {
  if ('PUT' != this.method) return yield next;

  let data = yield parse(this, {
    limit: '1kb'
  });

  let bookmark = yield bookmarks.find({}, {
    'skip': id - 1,
    'limit': 1
  });

  if (bookmark.length === 0) {
    this.throw(404, 'bookmark with id = ' + id + ' was not found');
  }

  let updated = bookmarks.update(bookmark[0], {
    $set: data
  });

  if (!updated) {
    this.throw(405, "Unable to update.");
  } else {
    this.body = "Done";
  }
};

module.exports.remove = function * remove(id,next) {
  if ('DELETE' != this.method) return yield next;


  let bookmark = yield bookmarks.find({}, {
    'skip': id - 1,
    'limit': 1
  });

  if (bookmark.length === 0) {
    this.throw(404, 'bookmark with id = ' + id + ' was not found');
  }

  let removed = bookmarks.remove(bookmark[0]);

  if (!removed) {
    this.throw(405, "Unable to delete.");
  } else {
    this.body = "Done";
  }

};

module.exports.head = function *(){
  return;
};

module.exports.options = function *() {
  this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
};

module.exports.trace = function *() {
  this.body = "Smart! But you can't trace.";
}

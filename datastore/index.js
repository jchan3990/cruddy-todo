const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  // Call getNextUniqueId as error-first cb
  counter.getNextUniqueId((err, id) => {
    // if Error, throw error
    if (err) {
      console.log('Cannot create ID');
    } else {
      // Else fs.writeFile(data, string, cb)
      // console.log(`${exports.dataDir}/${id}.txt`)
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          console.log('Cannot create file');
        } else {
          callback(null, {id, text});
        }
      })
    }
  })
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  const todos = [];

  // console.log(exports.dataDir, 'asdasdasd');
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(null, todos);
    }
  })

};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

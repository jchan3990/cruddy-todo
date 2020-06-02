const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
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
  var todos = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err || files.length === 0) {
      callback(null, todos);
    } else {
      // forEach on files array
      files.forEach((file) => {
        // todos.push(file);
        // console.log(`${exports.dataDir}/${file}`, 'adfadf')
        fs.readFile(`${exports.dataDir}/${file}`, (err, todoString) => {
          if (err) {
            callback(err);
          } else {
            var todo = todoString.toString();
            todos.push(todo);
            callback(null, todos);
          }
        })
      })
      callback(null, todos);
    }
  })
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    if (err) {
      callback(err);
    } else {
      var textString = text.toString()
      callback(null, {id: id, text: textString})
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          console.log('Can\'t Update');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }


};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

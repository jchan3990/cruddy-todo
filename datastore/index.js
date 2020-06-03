const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath)
        .then((fileData) => {
          return {id: id, text: fileData.toString()}
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      })
  });
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
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

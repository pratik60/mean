'use strict';

/**
 * Module dependencies.
 */
var config = require('meanio').loadConfig(),
  formidable = require('formidable'),
  MongoClient = require('mongodb').MongoClient,
  fs = require('fs'),
  Converter = require('csvtojson').core.Converter;

exports.getCollections = function(req, res) {

};

exports.uploadFile = function(req, res) {
  var dirpath = config.root + '/files/Documents/';
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, data_orig, files) {
    console.log(data_orig);
    fs.readFile(files.file.path, function(err, data) {
      var newPath = dirpath + files.file.name;
      fs.writeFile(newPath, data, function(err) {
        if (!err) {
          var csvFileName = newPath;
          //new converter instance
          var csvConverter = new Converter({
            constructResult: true
          });

          //end_parsed will be emitted once parsing finished
          csvConverter.on('end_parsed', function(jsonObj) {
            MongoClient.connect(config.db, function(err, db) {
              if (err) {
                return console.dir(err);
              }
              var collection = db.collection(data_orig.collection);
              collection.insert(jsonObj, function(err, result) {
                if (err)
                  throw err;

                console.log('entry saved');
              });

            });
            res.json(jsonObj); //here is your result json object
          });
          fs.createReadStream(csvFileName).pipe(csvConverter);
        }
      });
    });
  });
};

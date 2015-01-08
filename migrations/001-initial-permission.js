'use strict';

var config = require('./db');
var collections = ['variables'];
var db = require('mongojs').connect(config.db, collections);

exports.up = function(next) {
  db.variables.insert({
    'name': 'Roles',
    'data': [
      'admin',
      'authenticated'
    ]
  });
  db.variables.insert({
    'name': 'permission',
    'data': [{
      'roles': [
        'admin'
      ],
      'permission': 'canCreateArticle'
    }, {
      'roles': [
        'admin'
      ],
      'permission': 'canDeleteArticle'
    }, {
      'roles': [
        'admin',
        'authenticated'
      ],
      'permission': 'canManagePermission'
    }]
  }, next);
};
exports.down = function(next) {
  next();
};

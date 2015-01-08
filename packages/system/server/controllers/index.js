'use strict';

var mean = require('meanio'),
  mongoose = require('mongoose');
// Variable = mongoose.model('Variable');

exports.render = function(req, res) {

  var modules = [];
  // Preparing angular modules list with dependencies
  for (var name in mean.modules) {
    modules.push({
      name: name,
      module: 'mean.' + name,
      angularDependencies: mean.modules[name].angularDependencies
    });
  }

  function listPermissions(allPermission) { // checking for user role and permission
    var permission = [];
    allPermission[0].data.forEach(function(value) {
      value.roles.forEach(function(role) {
        if (req.user.roles.indexOf(role) > -1)
          permission.push(value.permission);
      });
    });
    return permission;
  }

  function isAdmin() {
    return req.user && req.user.roles.indexOf('admin') !== -1;
  }

  // var query = Variable.find({
  //   name: 'permission'
  // });
  // query.exec(function(err, allPermission) {
  res.render('index', {
    user: req.user ? {
      name: req.user.name,
      _id: req.user._id,
      username: req.user.username,
      roles: req.user.roles
    } : {},
    modules: modules,
    isAdmin: isAdmin,
    adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
  });
  // });
};

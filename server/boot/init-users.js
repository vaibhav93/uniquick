'use strict';

module.exports = function(app) {

  createDefaultUsers();

  function createDefaultUsers() {

    console.log('Creating roles and users');

    var User = app.models.UQUser;
    var Role = app.models.Role;
    // var manager = app.models.Manager;
    var userType = {
      User : User
    }
    var RoleMapping = app.models.RoleMapping;


    var users = [];
    var roles = [{
      name: 'admin',
      users: [{
        type:'User',
        name: 'Admin',
        email: 'admin@abc.com',
        username: 'admin',
        password: 'admin'
      }]
    }, {
      name: 'agent',
      users: [{
        type:'User',
        name: 'Varun',
        email: 'agent@abc.com',       
        username: 'agent',
        password: 'agent'
      }]
      }];
      


    roles.forEach(function(role) {
      Role.findOrCreate(
        {where: {name: role.name}}, // find
        {name: role.name}, // create
        function(err, createdRole, created) {
          if (err) {
            console.error('error running findOrCreate('+role.name+')', err);
          }
          (created) ? console.log('created role', createdRole.name)
                    : console.log('found role', createdRole.name);
          role.users.forEach(function(roleUser) {
            userType[roleUser.type].findOrCreate(
              {where: {username: roleUser.username}}, // find
              roleUser, // create
              function(err, createdUser, created) {
                if (err) {
                  console.error('error creating roleUser', err);
                }
                (created) ? console.log('created user', createdUser.username)
                          : console.log('found user', createdUser.username);
                          if(created)
                          {
                            createdRole.principals.create({
                              principalType: RoleMapping.USER,
                              principalId: createdUser.id
                            }, function(err, rolePrincipal) {
                              if (err) {
                                console.error('error creating rolePrincipal', err);
                              }
                              users.push(createdUser);
                            });
                          }
              });
          });
        });
    });
    return users;
  }

};

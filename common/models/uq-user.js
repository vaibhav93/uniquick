var app = require('../../server/server');

module.exports = function(UqUser) {
    UqUser.afterRemote('create', function(ctx, user, next) {
        //Create role mapping
        app.models.Role.findOne({
            where: {
                name: user.role
            }
        }, function(err, foundRole) {

            var RoleMapping = app.models.RoleMapping;
            foundRole.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
            }, function(err, rolePrincipal) {

            });
        });
        next();
    });
    UqUser.forgotPass = function(body, cb) {

        //console.log(vendor);
        UqUser.findById(body.vendorId, function(err, user) {
            //console.log(vendor);
            // var new_pass = shortid.generate().toUpperCase();
            //var BusinessModel = app.models.Business;
            if (err || !user) {
                cb(null, 'failed');
            }
            user.updateAttribute('password', body.password, function(err, updatedUser) {
                if (err || !updatedUser)
                    cb(null, 'failed');
                else {
                    cb(null, 'success');
                    console.log(updatedUser);
                }
            })
        })
    };
    UqUser.remoteMethod(
        'forgotPass', {
            accepts: {
                arg: 'data',
                type: 'object',
                http: {
                    source: 'body'
                }
            },
            returns: {
                arg: 'message',
                type: 'string'
            },
            http: {
                path: '/forgotpass',
                verb: 'POST'
            }
        });

};
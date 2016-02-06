var app = require('../../server/server');

module.exports = function(UqUser) {
	UqUser.afterRemote('create',function(ctx,user,next){
		//Create role mapping
		app.models.Role.findOne({where: {name: user.role}}, function(err, foundRole) {
			
			var RoleMapping = app.models.RoleMapping;
			foundRole.principals.create({
				principalType: RoleMapping.USER,
				principalId: user.id},function(err,rolePrincipal){

				});
		});
		next();
	})

};

module.exports = function(Case) {

Case.observe('before save', function (ctx, next) {

        var app = ctx.Model.app;

        //Apply this hooks for save operation only..
        if(ctx.isNewInstance){
            //suppose my datasource name is mongodb
            var mongoDb = app.dataSources.mongoDs;
            var mongoConnector = app.dataSources.mongoDs.connector;
            mongoConnector.collection("counters").findAndModify({collection: 'case'},[['_id','asc']], {$inc: { value: 1 }}, {new: true}, function(err, sequence) {
                if(err) {
                    throw err;
                } else {
                    // Do what I need to do with new incremented value sequence.value
                    //Save the tweet id with autoincrement..
                    ctx.instance.uid = sequence.value.value;

                    next();

                } //else
            });
        } //ctx.isNewInstance
        else{
            next(); 
        }
    }); //Observe before save..

};

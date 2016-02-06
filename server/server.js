var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var app = module.exports = loopback();
var staticPath = null;
var s3 = require('s3');

app.client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: "AKIAI5TNC4R6UD3DOOBQ",
    secretAccessKey: "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",
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});

var upload = multer({ dest: 'client/admin/assets/images',
  rename: function (fieldname, filename) {
    return filename+"_"+Date.now();
  } });

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var env = 'dev';
if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '../client/');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../dist/');
  console.log("Running app in prodction mode");
}
app.use(loopback.static(staticPath));
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

//upload img
app.post('/img', upload.single('file'), function(req, res,next) {
    //console.log(req.file);
    // console.log(req.body);
    var fullUrl = req.protocol + '://' + req.get('host')+'/';
    var temp_path = req.file.path;
    var dest = req.file.destination;
    if(req.body.businessId)

      dest = dest + '/business/' + req.body.businessId.slice(0,6);
    var new_path = dest+'/'+req.file.originalname;
    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }
    console.log(new_path);
    var arr = new_path.split("/");
    arr.splice(0,1);
    arr = arr.join("/");
    arr = fullUrl+arr;
    //console.log(arr);
    if(req.body.businessId){
      app.models.Business.findById(req.body.businessId,function(err,business){
        if(err || !business){
          console.log('Error: '+err);
        } else {
        // console.log(arr);
        var newArray = business.bookingimages;
        newArray.push(arr);
        // console.log(newArray);
        business.updateAttributes({bookingimages:newArray},function(err,updatedBusiness){
          // console.log(updatedBusiness);
        })
      }
    })
    }
    fs.rename(temp_path,new_path,function(err){
      if(err){
        //console.log(err);
      }});
    res.setHeader('Content-Type', 'application/json');
    res.json({img:arr});
  });
//export xls
app.get('/api/file/:name',function(req,res){
  var moment = require("moment");
  var json2csv = require('json2csv');
  // var fields = ['transactionid', 'saledate'];
  var fields= [
    // Supports label -> simple path
    {
      label: 'Transaction ID', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'transactionid', // data.path.to.something
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },

    // Supports label -> derived value
    {
      label: 'Sale Date', // Supports duplicate labels (required, else your column will be labeled [function])
      value: function(row) {
        return moment(row.saledate).format('DD-MM-YYYY');
      },
      default: 'NULL' // default if value fn returns falsy
    },{
      label: 'Verification Date', // Supports duplicate labels (required, else your column will be labeled [function])
      value: function(row) {
        return moment(row.verificationdate).format('DD-MM-YYYY');
      },
      default: 'NULL' // default if value fn returns falsy
    },
    {
      label: 'Username', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'username',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Payment mode', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'paymentmode', // data.path.to.something
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Amount', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'amount', // data.path.to.something
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Customer name', // (optional, column will be labeled 'path.to.something' if not defined)
      value: function(row) {
        return row.firstname+ ' '+row.lastname;
      },
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Contact', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'primaryno',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Alt. Contact', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'secondaryno',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Address', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'address',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'State', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'state',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Zipcode', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'zipcode',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    },{
      label: 'Email', // (optional, column will be labeled 'path.to.something' if not defined)
      value: 'email',
      default: 'NULL' // default if value is not found (optional, overrides `defaultValue` for column)
    }

  ];
  app.models.sale.find(function(err,sales){
    if(err){
      res.end(err,'error');
    }
    json2csv({ data: sales, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      fs.writeFile('Downloads/file.csv', csv, function(err) {
        if (err) throw err;
        
        res.sendFile(path.resolve(__dirname, '../Downloads/file.csv'));
        // res.end('hello,world\nkeesun,hi', 'UTF-8'); 
      });
    });
    // res.setHeader('Content-Type','application/vnd.openxmlformates');
    // res.setHeader("Content-Disposition","attachment;filename="+"todo.xlsx");
    // res.json({arr:'hi'});

  });
});
//Get role api
app.use('/api/getRole',function(req,res,next){

  var currentuser={};
  var tokenId = false;
  if (req.query && req.query.access_token) {
    tokenId = req.query.access_token;
    //res.send(tokenId);
  }
  if (tokenId){
    var UserModel = app.models.UQUser;

    // Logic borrowed from user.js -> User.logout()
    UserModel.relations.accessTokens.modelTo.findById(tokenId, function(err, accessToken) {
      if (err) next(err);
      if (!accessToken) {
        res.status(500).send({status:500, message: 'Invalid Access token', type:'internal'}); 
        res.end();
      }
      else{
        // Look up the user associated with the accessToken
        UserModel.findById(accessToken.userId, function (err, user) {
          if (err) {
            return next(err);
          }
          if (!user)  {
            res.status(500).send({status:500, message: 'Cannot find user', type:'internal'}); 
            res.end();
          }
          var roleMappingModel = app.models.RoleMapping;
          console.log(user);
          roleMappingModel.findOne({where:{principalId:user.id}},function(err,mappings){
            if(err) {
              next(err);
            }
            else{
              console.log(mappings);
              var roleModel = app.models.Role;
              roleModel.findOne({where:{id:mappings.roleId}},function(err,Role){
                if(err) console.log(err);
                else{
                  console.log(Role);
                  res.json(Role.name);
                }
              });
            }
          })
        });
      }
    });
}

});
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
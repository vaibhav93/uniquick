'use strict';
var schedule = require('node-schedule');
var moment = require('moment');
var backup = require('mongodb-backup');
var fs = require('fs'),
    path = require('path'),

    app = require('../../server/server');
var http = require('http');
var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/file/export.csv'
};
// var dump = require('dumpstr').dump;
module.exports = function(app) {
    // var rule = new schedule.RecurrenceRule();
    // rule.hour = 23;
    // rule.minute = 30;
    // var j = schedule.scheduleJob(rule, function() {
    //     //dump db
    //     var current = moment().format('DD-MM-YYYY');
    //     var backupComplete = function() {


    //         //dump db to S3
    //         var params = {
    //             localFile: 'Downloads/file.csv',
    //             s3Params: {
    //                 Bucket: "uniquickdb",
    //                 Key: 'uniquick-' + current + '.csv'
    //             }
    //         };
    //         var uploader = app.client.uploadFile(params);
    //         uploader.on('end', function() {
    //             //console.log("db uploaded to s3");
    //         });
    //     }
    //     http.get(options,function(res){
    //         res.on('data',function(chunk){
    //             backupComplete();
    //         })
    //     })

    // });
}
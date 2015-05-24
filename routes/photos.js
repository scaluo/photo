var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var Photo = require('../models/Photo');
var path = require('path');
var join = path.join;
var fs = require('fs');
var photos = [];
var photoPath = path.join(__dirname,'public/photos');

photos.push({
  name: 'Node.js logo',
  path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
  name: 'Ryan Speaking',
  path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

router.get('/',function(req,res,next){
  Photo.find({},function(err,photos){
    if (err) return next(err);
    res.render('photos',{title: 'Photos',photos: photos});
  });
});

router.get('/photo/:id/download',function(req,res,next){
  var id=req.params.id;
  Photo.findById(id,function(err,photo){
    if (err) return next(err);
    var path = join(__dirname,'../public/photos');
    var filepath = join(path,photo.path);
    res.sendFile(filepath);
  });
});

router.get('/upload',function(req,res,next){
  res.render('photos/upload',{title: 'Photo upload'});
});
router.post('/upload',function(req,res,next){
//  console.log('req.body:'+req.body);
  var form = new multiparty.Form({uploadDir: './public/photos/'});

  form.parse(req, function(err, fields, files) {
    var pname = fields.photoname[0];

    if(err) return next(err);
    var inputFile = files.photofile[0];
  //  console.log('req.body.photoname:'+req.body.photoname);
    var name = pname || inputFile.originalFilename;
    var fileName = path.basename(inputFile.path);

    Photo.create({name: name,path: fileName},function(err){
        if (err) return next(err);
        res.redirect('/');
    });

  });

});
module.exports = router;

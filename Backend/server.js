var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var path = require('path');
var fs = require('fs');

app.use(express.static(path.resolve('./public')));
app.use(express.json());

app.use(cors())

// let allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Headers', "*");
//   res.header('Access-Control-Request-Method', "*");
//   res.header('Access-Control-Allow-Methods', "*");
//   next();
// }

// app.use(allowCrossDomain);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
   		// console.log(file.originalname);
   		// console.log(req);
      cb(null, req.params.name+".jpeg" )
    }
  })
  
var upload = multer({ storage: storage }).array('file')
  
app.get('/',function(req,res){
    return res.send('Hello Server')
})

app.get('/content/:name',function(req,res){
	fs.readFile('./public/'+req.params.name+".txt", 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  // console.log(data);
	  res.send(data);
	});
})

app.post('/upload/:name',function(req, res) {
    // console.log("upload");
    // console.log(req);
    upload(req, res, function (err) {
     
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json(err)
          // An unknown error occurred when uploading.
        } 
        
        return res.status(200).send(req.file)
        // Everything went fine.
      })
});

app.post('/content/:name',function(req, res) {
    console.log(req.body);
    fs.writeFile(path.resolve('./public')+"/"+req.params.name+".txt", req.body.content, function (err) {
  		if (err) return console.log(err);
	});

    res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, function() {
    console.log('App running on port '+(process.env.PORT || 8080));
});
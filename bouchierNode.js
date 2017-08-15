/**
 * Created by Dylan on 6/07/15.
 */

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
const MongoStore = require('connect-mongo/es5')(session);
var WebSocketServer = require('ws').Server;
var app = express();

var cluster = require('cluster');


 if (cluster.isMaster) {

 // Count the machine's CPUs
 var cpuCount = require('os').cpus().length;

 // Create a worker for each CPU
 for (var i = 0; i < cpuCount; i += 1) {
 cluster.fork();
 }

 // Code to run if we're in a worker process
 } else {

     var path = require('path');
     var multipart = require('connect-multiparty');
     var ObjectID = require('mongodb').ObjectID;

// view engine setup
     app.set('views', path.join(__dirname, 'viewshjs'));
     app.locals.delimiters = '<% %>';
     app.set('view engine', 'hjs');

//var $ = require("mongous").Mongous;
// parse application/x-www-form-urlencoded

// Retrieve
     var MongoClient = require('mongodb').MongoClient;

// Connect to the db


     app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

// parse application/json
     app.use(bodyParser.json({limit: '50mb'}))
     app.use(session({
         secret: 'shshsh!!8282829--2"{}":}{]s]s][d[d[]ss[dsdsasklkjsdfj;n3334%$#&SGSGrrr',
         name: 'KissDocs',
         store: new MongoStore({url: process.env.MONGODB_URI}), // connect-mongo session store
         proxy: true,
         resave: true,
         saveUninitialized: true
     }));
     app.use(express.static(__dirname));


     var sess;


     app.post('/upload', upload.single('file'), function (req, res, next) {

         console.log('server got file');

     });
     app.get('/', function (req, res) {
         sess = req.session;

         if (req.session.crmid) {

             res.render('index', {title: 'CRM2'});

             //res.sendFile('/usr/share/nginx/html/MercuryCRM2/index.html')
         }
         else {
             //   res.render('index', {title: 'CRM2'});
             //res.sendFile('/usr/share/nginx/html/MercuryCRM2/index.html')
             res.redirect('login');

         }
     });


     app.get('/login', function (req, res) {
         sess = req.session;

         if (req.session.loggedon) {

             res.render('login', {title: 'CRM2'});

             //res.sendFile('/usr/share/nginx/html/MercuryCRM2/index.html')
         }
         else {
             res.render('login', {title: 'CRM2'});
             //res.sendFile('/usr/share/nginx/html/MercuryCRM2/index.html')


         }
     });

     app.post('/login', function (req, res, next) {


         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }
             sess = req.session;
             var r = req.body;
             var collection = db.collection('users');

             console.log(r.username,  r.password);
             collection.find({email: r.username, password: r.password}).toArray(function (err, docs) {

                 if (docs.length > 0) {
                     sess.crmid = docs[0]._id;
                     res.redirect('/')
                     db.close();
                 }
                 else {
                     res.redirect('/login')
                 }

             });


         })


     });


// Tasks GET, POST, DELETE


// Tasks GET, POST, DELETE

     app.get('/bookings', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('bookings');
             collection.find().toArray(function (err, docs) {
                 wss.broadcast('calendar updated');
                 res.json(docs);
                 db.close();
             });


         })


         //  res.json([{status:'ok'}]);
     });

     app.get('/clients', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('clients');
             collection.find().toArray(function (err, docs) {
                 res.json(docs);
                 db.close();
             });


         })


         //  res.json([{status:'ok'}]);
     });

// Get Users //

     app.get('/users', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('users');
             collection.find().toArray(function (err, docs) {
                 res.json(docs);
                 db.close();
             });


         })


         //  res.json([{status:'ok'}]);
     });

     app.post('/clients', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('clients');


             req.body._id = ObjectID(req.body._id);


             collection.save(req.body);

             res.json({status: 'ok'});
             db.close();
         })

         // $("Mercury.clients").find({"_id":req.body._id}, function(reply){

         // $("Mercury.clients").save();

         //     res.json({status:'ok'});
         // })

     });
     app.delete('/clients', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('clients');

             //  console.log(req.query._id);


             collection.remove({"_id": ObjectID(req.query._id)});


             res.json({status: 'ok'});
             db.close();
         })


     });

// NEW DATABASE URL SETUP START //

     app.get('/db/tasks/:ownerid', function (req, res) {
         var ownerid = req.params.ownerid;

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('tasks');
             collection.find({OwnerID: {$in: ownerid.split('|')}}).toArray(function (err, docs) {
                 res.json(docs);
             });
             db.close();

         })


         //  res.json([{status:'ok'}]);
     });

     app.get('/:db/create', function (req, res) {
         var dataBase = req.params.db;
         var record = JSON.parse(req.query.models)[0];
         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection(dataBase);


             record._id = null;


             collection.save(record, function (err, db) {

                 res.json(db.ops[0]);
                 //wss.broadcast('calendar created');
                 db.close();
             });

         });

     });

     app.get('/:db/update', function (req, res) {
         var dataBase = req.params.db;
         var record = JSON.parse(req.query.models)[0];
         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }
             var collection = db.collection(dataBase);


             record._id = ObjectID(record._id);
             collection.save(record);
             // wss.broadcast('calendar updated');
             res.json(record);
             db.close();
         });

     });

     app.get('/:db/destroy', function (req, res) {
         var dataBase = req.params.db;
         var record = JSON.parse(req.query.models)[0];
         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }
             var collection = db.collection(dataBase);


             collection.remove({"_id": ObjectID(record._id)});
             wss.broadcast('calendar deleted');

             res.json({_id: 12345});
         });

     });
// NEW DATABASE URL SETUP END //

     /* USERS !!!  */


     app.get('/db/:db', function (req, res) {
         var dataBase = req.params.db;

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection(dataBase);
             collection.find().toArray(function (err, docs) {
                 res.json(docs);
                 db.close();
             });


         })


         //  res.json([{status:'ok'}]);
     });

     app.get('/db/:db/:meat', function (req, res) {
         var dataBase = req.params.db;
         var meat = req.params.meat;
         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection(dataBase);
             collection.find({meat: meat}).toArray(function (err, docs) {
                 res.json(docs);
                 db.close();
             });


         })


         //  res.json([{status:'ok'}]);
     });


     app.post('/db/:db', function (req, res) {
         var dataBase = req.params.db;

         if (dataBase == 'orders') {
             // EDIT THESE VALUES

             var from = "Peter Bouchier <orders@petergbouchier.com.au>";
             to = req.body.customerEmail;
             sendmail_command = "sendmail";


             var smtpConfig = {
                 host: 'smtp-relay.gmail.com',
                 port: 587,
                 secure: false, // use SSL

             };

             var nodemailer = require('nodemailer');
             var items = req.body.items;
             var orderItems = "";
             for (i = 0; i < items.length; i++) {
                 if (items[i].weightQty && !items[i].productRequests) {
                     orderItems += items[i].weightQty + 'kg x ' + items[i].title + '\n';
                 }
                 if (items[i].unitQty && !items[i].productRequests) {
                     orderItems += items[i].unitQty + ' x ' + items[i].title + '\n';
                 }
                 if (items[i].weightQty && items[i].productRequests) {
                     orderItems += items[i].weightQty + 'kg x ' + items[i].title + ' ' + '(' + items[i].productRequests + ')' + '\n';
                 }
                 if (items[i].unitQty && items[i].productRequests) {
                     orderItems += items[i].unitQty + ' x ' + items[i].title + ' ' + '(' + items[i].productRequests + ')' + '\n';
                 }
             }
             // create reusable transporter object using the default SMTP transport
             var transporter = nodemailer.createTransport('smtp://seb@photocopiersolutions.com.au:Totobingo88@smtp-relay.gmail.com');
             var mail = '<br>' +
                 'Order Number: ' + req.body.orderNumber + '<br>' +
                 'Pick Up Date: ' + req.body.pickUpDate + '/12/16<br>' +
                 '<br>' +
                 'Hello ' + req.body.customerName + ',<br>' +
                 'Thank you for your order with Peter Bouchier at our ' + req.body.store + ' store. We hope you enjoyed your experience and we look forward to seeing you again soon! Please do not reply to this email. For any queries regarding your order, please contact the store where you place your order. <br>' +
                 '<br>' +
                 'Order Summary:<br>' + orderItems;
             // setup e-mail data with unicode symbols
             var mailOptions = {
                 from: from, // sender address
                 to: to, // list of receivers
                 subject: 'Your Peter Bouchier Order', // Subject line
                 text: mail, // plaintext body
                 html: mail // html body
             };

             transporter.sendMail(mailOptions, function (error, info) {
                 if (error) {
                     return console.log(error);
                 }
                 console.log('Message sent: ' + info.response);
             });

         }
         ;

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }
             var collection = db.collection(dataBase);

             req.body._id = ObjectID(req.body._id);
             collection.save(req.body, function (err, r) {

                 res.json({order: r.result.upserted});
                 db.close();
             });
         })

         // $("Mercury.clients").find({"_id":req.body._id}, function(reply){

         // $("Mercury.clients").save();

         //     res.json({status:'ok'});
         // })

     });

     app.delete('/db/:db', function (req, res) {
         var dataBase = req.params.db;
         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection(dataBase);

             //  console.log(req.query._id);


             collection.remove({"_id": ObjectID(req.query._id)});


             res.json({status: 'ok'});
             db.close();
         })


     });

     app.post('/users', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('users');


             req.body._id = ObjectID(req.body._id);


             collection.save(req.body);

             res.json({status: 'ok'});
             db.close();
         })

         // $("Mercury.clients").find({"_id":req.body._id}, function(reply){

         // $("Mercury.clients").save();

         //     res.json({status:'ok'});
         // })

     });
     app.delete('/users', function (req, res) {

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('users');

             //  console.log(req.query._id);


             collection.remove({"_id": ObjectID(req.query._id)});


             res.json({status: 'ok'});
             db.close();
         })


     });


     app.use(multipart({
         uploadDir: __dirname + '/assets/images/xmas.min/'
     }));

     app.post('/uploads', function (req, res, next) {

         var uploadPath = ''
             , file = req.files.file;
         //  console.log(path.basename(file.path)); //tmp path (ie: /tmp/12345-xyaz.png)
         //  console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

         var uploadedFile = {
             name: file.name, url: path.basename(file.path)
         }

         res.json(uploadedFile);
     });

     app.post('/login', function (req, res) {
         var oo = false;
         sess = req.session;

         MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
             if (err) {
                 return console.dir(err);
             }

             var collection = db.collection('users');
             collection.find({username: req.body.username, password: req.body.password}).toArray(function (err, docs) {


                 if (docs.length > 0) {
                     oo = true;
                     sess.username = docs[0]
                 }


                 if (oo) {
                     sess.loggedon = true;
                     sess.username = docs[0]
                     //sess.username=req.body.username;
                     res.redirect('/');
                 }
                 else {
                     res.redirect('/login');

                 }

             });
         });
     });


     app.get('/user', function (req, res) {
         sess = req.session;
         // if (sess.username) {
         res.json({username: sess.crmid})
         // }
         //else {

         //    res.redirect('/login');
         // }

     });
//In this we are assigning email to sess.email variable.
//email comes from HTML page.


     app.get('/admin', function (req, res) {
         sess = req.session;
         if (sess.username) {
             res.write('<h1>Hello' + sess.username + '</h1>');
             res.end('<a href="/login">Logout</a>');
         }
         else {
             res.write('<h1>Please login first.</h1>');
             res.end('<a href="/login">Login</a>');
         }

     });


     app.get('/logout', function (req, res) {
         sess.loggedon = false;
         req.session.destroy(function (err) {
             if (err) {
                 console.log(err);
             }
             else {
                 req.session = '';
                 sess.loggedon = false;
                 res.redirect('/login');
             }
         });

     });


     app.get(/(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
         console.info("pdf");
         var pdfPath = req.params[0];
         var pageNumber = req.params[1];

         var PDFImage = require("pdf-image").PDFImage;
         var pdfImage = new PDFImage(path.join(__dirname, 'mercury/public/' + pdfPath));

         pdfImage.convertPage(pageNumber).then(function (imagePath) {
             res.sendFile(imagePath);
         }, function (err) {
             res.send(err, 500);
         });
     });

     var server = app.listen(3005, function () {

         var host = server.address().address;
         var port = server.address().port;

         console.log('Example app listening at http://%s:%s', host, port);

     })

///#### websockets #####\\\

     var wss = new WebSocketServer({server: server});
     wss.on('connection', function connection(ws) {

         console.log("conecction!!!!!!!", ws);
         ws.on('message', function incoming(message) {
             //  console.log('received: %s', message);
         });

         ws.send('something');
     });

     wss.broadcast = function broadcast(data) {
         wss.clients.forEach(function each(client) {
             client.send(data);
         });
     }

     wss.on('open', function open() {
         console.log('connected');
         wss.send(Date.now().toString(), {mask: true});
     });

     wss.on('close', function close() {
         console.log('disconnected');
     });
//}
 }
// Listen for dying workers
cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

});

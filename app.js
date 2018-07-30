const Connections = require('./js/connections.js');
let conn = new Connections();

var express  = require('express');
var http = require('http');
var logger = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
//var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();

//app.set('view engine', 'html');

//var session = require('express-session');
//app.use(session({secret: "Shh, its a secret!"}));
//app.use(session({
//    secret: "That's a secret!",//cookie_secret,
//    resave: true,
//    saveUninitialized: true
//}));

app.use(cookieParser());
app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({                                 // parse application/x-www-form-urlencoded
   parameterLimit: 100000,                // bigger parameter sizes
   limit: '5mb',                          // bigger parameter sizes
   extended: false
 }));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});


var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8000 || process.env.PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('server is up')
})
//app.listen(8000 || process.env.PORT);
//app.set('port', 8000 || process.env.PORT);

var timeleft = (12*60*60*1000);
setInterval(function() {
  timeleft -= 1000;
  io.emit('timeleft', { timeleft: timeleft });
}, 1000);

io.set('origins', '*:*');

io.on('connection', function(socket){
  conn.addConnection();
  io.emit('userconnected', { online: conn.connections, since: conn.connectionsSince });
  socket.on('disconnect', function(){
    conn.removeConnection();
  });
});

var optionsCompile = {
  timeout: 10000, // 5 seconds is already a lot... but C# is requiring 10!
  killSignal: 'SIGKILL'
}

var optionsPythonDeployAndInvoke = {
  timeout: 300000, // 5 min is a lot already!
  killSignal: 'SIGKILL'
}


/*
function promiseFromChildProcess(child) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    });
}
*/

app.post('/getvars', function(req, res){
  res.setHeader('Content-Type', 'text/json; charset="utf-8"');
  res.send('{"commit":"'+process.env.COMMIT_GIT_VERSION+'"}');
});

app.get('/statusnode1', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  //var cmddocker = 'docker exec -t eco-neo-csharp-nodes-running dash -i -c "print1.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neocli-node1/*.log | tail -n 50';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.send(x);
    }
  });
});
app.get('/statusnode2', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  //var cmddocker = 'docker exec -t eco-neo-csharp-nodes-running dash -i -c "print2.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neocli-node2/*.log | tail -n 50';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.send(x);
    }
  });
});
app.get('/statusnode3', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  //var cmddocker = 'docker exec -t eco-neo-csharp-nodes-running dash -i -c "print3.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neocli-node3/*.log | tail -n 50';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.send(x);
    }
  });
});
app.get('/statusnode4', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  //var cmddocker = 'docker exec -t eco-neo-csharp-nodes-running dash -i -c "print4.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neocli-node4/*.log | tail -n 50';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.send(x);
    }
  });
});

app.get('/notifications', function(req, res) {
  var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  //var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-logger/prompt.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});

app.get('/txnotifications', function(req, res) {
   var txid = "";
   //console.log(req);
   //console.log(JSON.stringify(req));
   if(req.query.txid) { // txid
      txid = req.query.txid;
      console.log(txid);
      if(txid.length != 64)
         txid = "";
      // sanitize hex chars (only lower case)
      var re = /[0-9a-f]{6}/g;
      if(re.test(txid)) {
         //alert('valid hex');
      } else {
         //alert('invalid');
         txid = "";
      }
      re.lastIndex = 0;
  }
  if(txid == "")
    return;

  var cmddocker = 'docker exec -t eco-neo-csharp-nodes-running cat opt/node1/neo-cli/ApplicationLogs_0000DDB1/0x'+txid+".json";

  //var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-logger/prompt.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});

app.get('/restlog', function(req, res) {
  //var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-rest-rpc/saida.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});

app.get('/rpclog', function(req, res) {
  //var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-rest-rpc/saida_rpc.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});


app.post('/compilex', function(req, res) {
  // Specifies which URL to listen for
  // req.body -- contains form data

  //console.log("python: "+req.body.codesend_python);
  //console.log("cs: "+req.body.codesend_cs);
  //console.log("go: "+req.body.codesend_golang);
  //console.log("java: "+req.body.codesend_java);

  var imagename = "";
  var code64 = "";

  if(req.body.codesend_python) { // Python
    imagename = "docker-neo-boa";
    code64 = new Buffer(req.body.codesend_python, 'ascii').toString('base64');
  }
  else if(req.body.codesend_golang) { // Golang
    imagename = "docker-neo-go";
    code64 = new Buffer(req.body.codesend_golang, 'ascii').toString('base64');
  }
  else if(req.body.codesend_java) { // Java
    imagename = "docker-java-neo-compiler";
    code64 = new Buffer(req.body.codesend_java, 'ascii').toString('base64');
  }
  else if(req.body.codesend_cs) { // C#
    imagename = "docker-mono-neo-compiler";
    code64 = new Buffer(req.body.codesend_cs, 'ascii').toString('base64');
  }

  if(imagename != "")
  {
      var cmddocker = "docker run -e COMPILECODE=" + code64 + " -t --rm " + imagename;
      var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout, stderr)=> {

      if (e instanceof Error) {
        console.error(e);
        var msg64 = new Buffer("Internal Error:\n"+e,'ascii').toString('base64');
        var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
        res.send(msgret);
        //throw e;
      }
      else {
        //console.log('stdout ', stdout);
        //console.log('stderr ', stderr);
        res.send(stdout);
      }
    }); // child
  } // if
  else {
    var msg64 = new Buffer("Unknown Compiler!",'ascii').toString('base64');
    var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
    res.send(msgret);
  }

}); // End of compilex

app.post('/deployx', function(req, res) {
  console.log("Calling app.post route /deployx. Import contract!\n");

  var codeavm = new Buffer(req.body.codeavm, 'ascii').toString('base64');
  var contracthash = new Buffer(req.body.contracthash, 'ascii').toString('base64');
  var contractparams = new Buffer(req.body.contractparams, 'ascii').toString('base64');
  var contractreturn = new Buffer(req.body.contractreturn, 'ascii').toString('base64');

  pythonScreenName = ""; // screen name inside container
  pythonContName = "";   // container name
  if(req.body.wallet_deploy == "w1.wallet") {
    pythonScreenName = new Buffer("pythonW1", 'ascii').toString('base64');
    pythonContName = "w1";
  }
  if(req.body.wallet_deploy == "w2.wallet") {
    pythonScreenName = new Buffer("pythonW2", 'ascii').toString('base64');
    pythonContName = "w2";
  }
  if(req.body.wallet_invoke == "w3.wallet") {
    pythonScreenName = new Buffer("pythonW3", 'ascii').toString('base64');
    pythonContName = "w3";
  }
  if(req.body.wallet_invoke == "w4.wallet") {
    pythonScreenName = new Buffer("pythonW4", 'ascii').toString('base64');
    pythonContName = "w4";
  }

  var cbx_storage = "False";
  if(req.body["cbx_storage"])
    cbx_storage = "True";
  cbx_storage=new Buffer(cbx_storage, 'ascii').toString('base64');

  var cbx_dynamicinvoke = "False";
  if(req.body["cbx_dynamicinvoke"])
    cbx_dynamicinvoke = "True";
  cbx_dynamicinvoke=new Buffer(cbx_dynamicinvoke, 'ascii').toString('base64');

  var cmddocker = 'docker exec -t eco-neo-python-'+pythonContName+'-running dash -i -c "/opt/pythonScreenDeploy.sh '+
       pythonScreenName + ' ' + contracthash + ' ' + codeavm + ' ' + contractparams + ' ' + contractreturn + ' ' + cbx_storage + ' ' + cbx_dynamicinvoke + '"';

  console.log("SC Deploy: import contract");
  console.log(cmddocker);


  //res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  var child = require('child_process').exec(cmddocker, optionsPythonDeployAndInvoke, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      console.log(x);

      x = x.replace(/(\r\n|\n|\r)/gm,"");

      console.log("TimeToFinish");
      res.send(x);
    }
  });

});

app.post('/invokex', function(req, res) {
  console.log("hash:"+req.body.invokehash+" params:"+req.body.invokeparams);
  console.log("wallet:"+req.body.wallet_invoke);

  var invokehash = new Buffer(req.body.invokehash, 'ascii').toString('base64');
  var invokeparams = new Buffer(req.body.invokeparams, 'ascii').toString('base64');
  var attachneo = new Buffer(req.body.attachneo, 'ascii').toString('base64');
  var attachgas = new Buffer(req.body.attachgas, 'ascii').toString('base64');

  var cbx_invokeonly = "0";
  if(req.body["cbx_invokeonly"])
    cbx_invokeonly = "1";
  cbx_invokeonly=new Buffer(cbx_invokeonly, 'ascii').toString('base64');

  console.log("invokeonly is :" + cbx_invokeonly)

  pythonScreenName = ""; // screen name inside container
  pythonContName = "";   // container name
  if(req.body.wallet_invoke == "w1.wallet") {
    pythonScreenName = new Buffer("pythonW1", 'ascii').toString('base64');
    pythonContName = "w1";
  }
  if(req.body.wallet_invoke == "w2.wallet") {
    pythonScreenName = new Buffer("pythonW2", 'ascii').toString('base64');
    pythonContName = "w2";
  }
  if(req.body.wallet_invoke == "w3.wallet") {
    pythonScreenName = new Buffer("pythonW3", 'ascii').toString('base64');
    pythonContName = "w3";
  }
  if(req.body.wallet_invoke == "w4.wallet") {
    pythonScreenName = new Buffer("pythonW4", 'ascii').toString('base64');
    pythonContName = "w4";
  }


  var cmddocker = 'docker exec -t eco-neo-python-'+pythonContName+'-running dash -i -c "/opt/pythonScreenInvoke.sh '+
       pythonScreenName+' '+ invokehash+' '+ invokeparams + ' ' + attachneo + ' ' + attachgas + ' ' + cbx_invokeonly + '"';//'" | base64';
  var outp = "";

  console.log(cmddocker);
  console.log("calling testinvoke");

  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  var child = require('child_process').exec(cmddocker, optionsPythonDeployAndInvoke, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      console.log(x);

      x = x.replace(/(\r\n|\n|\r)/gm,"");
  //outp = require('child_process').execSync(cmddocker).toString();
  //outp = outp.replace(/(\r\n|\n|\r)/gm,"");
  //outp = '{"output":"'+outp+'"}';
  //res.send(JSON.parse(outp));

      console.log("TimeToFinish Invoke");
      res.send(x);
    }
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

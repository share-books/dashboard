let fs = require('fs')
let path = require('path')
let express = require('express')
let player=require('./play-video')

//let proxyMiddleware = require('http-proxy-middleware')

let port = 3000
let app = express(),
	exec = require('child_process').exec,
	util = require('util'),
	Files = {};

let server = require('http').Server(app); 
let {start} = require('./upload-service'); 
let io = require('socket.io')(server); 

start(io)


app.use('/static', express.static('./static'))

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
		});
}

let uri = 'http://localhost:' + port
app.get('/play',player.playVideo)

app.get('/', handler);
server.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(uri)
})




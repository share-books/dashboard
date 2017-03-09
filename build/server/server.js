let fs = require('fs')
let path = require('path')
let express = require('express')
//let proxyMiddleware = require('http-proxy-middleware')
//let webpackConfig = require('./webpack.dev.conf')
//let {playVideo} = require('./server/play-video')
// default port where dev server listens for incoming traffic


let port = 8000
//let proxyTable = config.dev.proxyTable

let app = express()
let io = require('socket.io').listen(app),
	exec = require('child_process').exec,
	util = require('util'),
	Files = {};

function playVideo (req, res) {
  console.log("playVideo")
 
  let file = path.resolve(__dirname, "static/demo.mp4");
  fs.stat(file, function (err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 Error if file not found
        console.log("file not found")
        res.statusCode = 404;
        return res;
      }
      res.end(err);
    }
    let range = req.headers.range || "bytes=0-";
    // console.log(req.headers)
    if (!range) {
      // 416 Wrong range
      console.log("Wrong range")
      res.statusCode = 416;
      return res;
    }
    let positions = range.replace(/bytes=/, "").split("-");
    let start = parseInt(positions[0], 10);
    let total = stats.size;
    let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    let chunksize = (end - start) + 1;

    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });

    let stream = fs.createReadStream(file, {
        start: start,
        end: end
      })
      .on("open", function () {
        stream.pipe(res);
      }).on("error", function (err) {
        res.end(err);
      });
  });
}

io.sockets.on('connection', function (socket) {
	socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
		var Name = data['Name'];
		Files[Name] = { //Create a new Entry in The Files Variable
			FileSize: data['Size'],
			Data: "",
			Downloaded: 0
		}
		var Place = 0;
		try {
			var Stat = fs.statSync('Temp/' + Name);
			if (Stat.isFile()) {
				Files[Name]['Downloaded'] = Stat.size;
				Place = Stat.size / 524288;
			}
		} catch (er) {} //It's a New File
		fs.open("Temp/" + Name, 'a', 0755, function (err, fd) {
			if (err) {
				console.log(err);
			} else {
				Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
				socket.emit('MoreData', {
					'Place': Place,
					Percent: 0
				});
			}
		});
	});

	socket.on('Upload', function (data) {
		var Name = data['Name'];
		Files[Name]['Downloaded'] += data['Data'].length;
		Files[Name]['Data'] += data['Data'];
		if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
		{
			fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
				var inp = fs.createReadStream("Temp/" + Name);
				inp.on("end", function () {
					fs.unlink("Temp/" + Name, function () { //This Deletes The Temporary File
						/*exec("ffmpeg -i Video/" + Name  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg Video/" + Name  + ".jpg", function(err){
							socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
						});*/
						socket.emit('Done', {
							'Image': '/static/demo.jpg'
						});
					});
				});
				var out = fs.createWriteStream("Video/" + Name);
				inp.pipe(out)
					//	util.pump(inp, out, function(){
					//	});
			});
		} else if (Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
			fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
				Files[Name]['Data'] = ""; //Reset The Buffer
				var Place = Files[Name]['Downloaded'] / 524288;
				var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
				socket.emit('MoreData', {
					'Place': Place,
					'Percent': Percent
				});
			});
		} else {
			var Place = Files[Name]['Downloaded'] / 524288;
			var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
			socket.emit('MoreData', {
				'Place': Place,
				'Percent': Percent
			});
		}
	});
});



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
app.get('/play',playVideo)

app.get('/', handler);
app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(uri)
})




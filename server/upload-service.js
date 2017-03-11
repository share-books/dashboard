
let fs = require('fs')
let path = require('path')


  let  Files = {}

  function  onStart(socket, data){
    let Name = data['Name'];
    Files[Name] = { //Create a new Entry in The Files Variable
      FileSize: data['Size'],
      Data: "",
      Downloaded: 0
    }
    let Place = 0
    try {
      let Stat = fs.statSync('temp/' + Name)
      if (Stat.isFile()) {
        Files[Name]['Downloaded'] = Stat.size
        Place = Stat.size / 524288
        console.log(Name,"have data:",Stat.size)
      }
    } catch (er) {
      console.log(Name,"is new")
     } //It's a New File
    fs.open("temp/" + Name, 'a', 0775, function (err, fd) {
      if (err) {
        console.log(err)
      } else {
      //  Files[Name]={}
      console.log(Name," created!")
        Files[Name]['Handler'] = fd //We store the file handler so we can write to it later
         Files[Name]['Downloaded'] = 0
        socket.emit('MoreData', {
           Place,
           Percent: 0
        })
      }
    })

  }
 function onUpload(socket, data) {
    let Name = data['Name'];
   // console.log(data)
    //console.log(Files[Name])
    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];
    console.log(Files[Name]['Downloaded'])
    if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
    {
      fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
        var inp = fs.createReadStream("temp/" + Name)
        inp.on("end", function () {
          fs.unlink("temp/" + Name, function () { //This Deletes The Temporary File
            //exec("ffmpeg -i Video/" + Name  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg Video/" + Name  + ".jpg", function(err){
            //		socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
            //	});
            socket.emit('Done', {'Image' : '/static/OK.jpg'});

          })
        })
        var out = fs.createWriteStream(__dirname+"/upload/" + Name)
        inp.pipe(out)
      })
    } else if (Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
      fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
        Files[Name]['Data'] = ""; //Reset The Buffer
        var Place = Files[Name]['Downloaded'] / 524288;
        var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100
        socket.emit('MoreData', {
          'Place': Place,
          'Percent': Percent
        })
      })
    } else {
      var Place = Files[Name]['Downloaded'] / 524288
      var Percent = (Files[Name]['Downloaded'] /Files[Name]['FileSize']) * 100
      socket.emit('MoreData', {
        'Place': Place,
        'Percent': Percent
      })
    }
  }

  exports.start=(io)=>{
    console.log('Starting socket.io upload service')
    io.sockets.on('connection', function (socket) {
      socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
        onStart(socket, data)
      })
      socket.on('Upload', function (data) {
        onUpload(socket, data)
      })
    })
  }

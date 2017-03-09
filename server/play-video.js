let fs = require('fs')
let path = require('path')

//exports.playVideo
exports.playVideo=function (req, res) {

 
  let file = path.resolve(__dirname, "./upload/demo.mp4");
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
    let str="bytes " + start + "-" + end + "/" + total;
    res.writeHead(206, {
      "Content-Range":str ,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });
  console.log(range)
    let stream = fs.createReadStream(file, {
        start: start,
        end: end
      })
      stream.on("open", function () {
        stream.pipe(res);
      }).on("error", function (err) {
        res.end(err);
      });
  });
}
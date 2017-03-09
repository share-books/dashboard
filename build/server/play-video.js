let fs = require('fs')
let path = require('path')

exports.playVideo=function (req, res) {
  console.log("playVideo")
 
  let file = path.resolve(__dirname, "../../static/demo.mp4");
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
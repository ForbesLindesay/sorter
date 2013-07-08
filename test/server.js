var browserify = require('browserify-middleware')
var express = require('express')
var app = express()
app.get('/client.js', browserify('./client.js'))
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html')
})
app.listen(3000)
console.log('listening on localhost:3000')
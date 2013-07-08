var sorter = require('../')
var arrayify = require('arrayify')

sorter('#table')
  .on('sort', function (table, header, direction) {
    console.log(header.textContent + ' => ' + direction)
  })
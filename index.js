'use strict'

var EventEmitter = require('events').EventEmitter
var insertCSS = require('insert-css')
var arrayify = require('arrayify')
var DOMinate = require('dominate')
insertCSS('.sorter { width: 1em; height: 1em; } .sorter-down .sorter-up-arrow { display: none; } .sorter-up .sorter-down-arrow { display: none; }')

module.exports = function (table, options) {
  if (typeof table === 'string') {
    return new TableSorterSet(table, options)
  } else {
    return new TableSorter(table, options)
  }
}
module.exports.DefaultSortControl = DefaultSortControl

function add(el, cls) {
  if (el.classList) return el.classList.add(cls)
}
function remove(el, cls) {
  if (el.classList) return el.classList.remove(cls)
}

function DefaultSortControl(th, options) {
  if (!(this instanceof DefaultSortControl)) return new DefaultSortControl(th, options)
  options = options || {}
  options.up = options.up || 'sorter-up'
  options.down = options.down || 'sorter-down'
  this.options = options
  var element = DOMinate(
    ['svg.' + (options.sorter || 'sorter'), {viewBox:'-4,-4,108,108', version:'1.1'},
      ['polygon.' + (options.upArrow || 'sorter-up-arrow'), {points:'0,47.5 50,0 100,47.5'}],
      ['polygon.' + (options.downArrow || 'sorter-down-arrow'), {points:'0,52.5 50,100 100,52.5'}]
    ], 'http://www.w3.org/2000/svg')
  th.appendChild(element)
  this.element = element
}
DefaultSortControl.prototype.clear = function () {
  remove(this.element, this.options.up)
  remove(this.element, this.options.down)
}
DefaultSortControl.prototype.up = function () {
  add(this.element, this.options.up)
  remove(this.element, this.options.down)
}
DefaultSortControl.prototype.down = function () {
  remove(this.element, this.options.up)
  add(this.element, this.options.down)
}

function TableSorterSet(tables, options) {
  tables = arrayify(tables, {query: true})
  EventEmitter.call(this)
  var self = this
  this.tables = tables.map(function (table) {
    var sorter = new TableSorter(table, options)
    var emit = sorter.emit
    sorter.emit = function (name) {
      self.emit.apply(self, arguments)
      emit.apply(this, arguments)
    }
    return sorter
  })
}
TableSorterSet.prototype = Object.create(EventEmitter.prototype)
TableSorterSet.prototype.constructor = TableSorterSet
TableSorterSet.prototype.sort = function (th, direction, silent) {
  this.tables.forEach(function (table) {
    table.sort(th, direction, silent)
  })
}
TableSorterSet.prototype.clear = function (silent) {
  this.tables.forEach(function (table) {
    table.clear(silent)
  })
}
/**
 * Return an event emitter that emits `sort(table, tableHeader, direction)` and `clear(table)` as events and has the additional API methods `sort(th, direction, silent)` and `clear(silent)`
 * 
 * @param {Element}   table
 * @param {Object=}   options
 * @param {String=}   options.th          A query selector for the collection of table headers
 * @param {Function=} options.sortControl A function that takes an the table header element and options block and returns an object with `up`, `down` and `clear` methods
 * @param {String=}   options.sorter      The `sorter` class
 * @param {String=}   options.up          The `sorter-up` class
 * @param {String=}   options.down        The `sorter-down` class
 * @param {String=}   options.upArrow     The `sorter-up-arrow` class
 * @param {String=}   options.downArrow   The `sorter-down-arrow` class
 * @return {TableSorter} Inherits EventEmitter
 */
function TableSorter(table, options) {
  EventEmitter.call(this)
  this.table = table
  options = options || {}
  this.headers = arrayify(typeof options.th === 'string' ? table.querySelectorAll(options.th) : options.th || table.getElementsByTagName('th'))
    .map(function (th) {
      return {
        th: th,
        sorter: (options.sortControl || DefaultSortControl)(th, options),
        direction: null
      }
    })
  for (var i = 0; i < this.headers.length; i++) {
    this.headers[i].th.addEventListener('click', this.sort.bind(this, this.headers[i].th, null, false), false)
  }
}
TableSorter.prototype = Object.create(EventEmitter.prototype)
TableSorter.prototype.constructor = TableSorter

TableSorter.prototype.sort = function sort(th, direction, silent) {
  var column
  for (var i = 0; i < this.headers.length; i++) {
    if (this.headers[i].th != th && this.headers[i].direction !== null) {
      this.headers[i].sorter.clear()
      this.headers[i].direction = null
    } else if (this.headers[i].th === th) {
      column = this.headers[i]
    }
  }
  if (th) {
    if (direction === 'up' || (!direction && column.direction === 'down')) {
      column.direction = 'up'
      column.sorter.up()
    } else {
      column.direction = 'down'
      column.sorter.down()
    }
  }
  if (silent) return
  if (th) this.emit('sort', this.table, column.th, column.direction)
  else this.emit('clear', this.table)
}
TableSorter.prototype.clear = function clear(silent) {
  return this.sort(false, null, silent)
}
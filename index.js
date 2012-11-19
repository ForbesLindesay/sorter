var classes = require('classes');
var toElementArray = require('to-element-array');
var DOMinate = require('DOMinate');

function Sorter(element) {
  this.el = element;
  this.cls = classes(element);
}
Sorter.prototype.toggle = function () {
  if (this.cls.has('sorter-down')) {
    return this.up();
  } else {
    return this.down();
  }
}
Sorter.prototype.clear = function (unless) {
  if (!unless || this.el != toElementArray(unless)[0])
    this.cls.remove('sorter-down').remove('sorter-up');
}
Sorter.prototype.up = function () {
  this.cls.remove('sorter-down').add('sorter-up');
  return 'up';
}
Sorter.prototype.down = function () {
  this.cls.remove('sorter-up').add('sorter-down');
  return 'down';
}

function defaultSortControl() {
  return DOMinate(
    ['svg.sorter', {viewBox:'-4,-4,108,108', version:'1.1'},
      ['polygon.sorter-arrow.sorter-up-arrow', {points:'0,52.5 50,100 100,52.5'}],
      ['polygon.sorter-arrow.sorter-down-arrow', {points:'0,47.5 50,0 100,47.5'}]
    ], 'http://www.w3.org/2000/svg');
}

module.exports = sorters;
function sorters(elements) {
  if (elements instanceof sorters) return elements;
  else if (!(this instanceof sorters)) return new sorters(elements);
  function makeFn(name) {
    return function () {
      var args = arguments;
      var first = true;
      var result;
      toElementArray(elements)
        .forEach(function (element) {
          var s = new Sorter(element);
          var res = s[name].apply(s, args);
          if (first || result === res) result = res;
          else result = undefined;
          first = false;
        });
      return result;
    };
  }
  this.up = makeFn('up');
  this.down = makeFn('down');
  this.toggle = makeFn('toggle');
  this.clear = makeFn('clear');
}
sorters.appendToParent = function (elements) {
  var res = toElementArray(elements)
    .map(function (element) {
      var sorter = defaultSortControl();
      element.appendChild(sorter);
      return sorter;
    });
  return sorters(res);
}
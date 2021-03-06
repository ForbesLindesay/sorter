
# sorter

  A sorter control for JavaScript (just a simple SVG up down arrow).

[![Dependency Status](https://img.shields.io/david/ForbesLindesay/sorter.svg)](https://david-dm.org/ForbesLindesay/sorter)
[![NPM version](https://img.shields.io/npm/v/sorter.svg)](https://www.npmjs.com/package/sorter)

## Installation

    $ npm install sorter

## Guide

Creates a simple svg image with three states and appends it to each column:

![diagram of three states](http://i.imgur.com/2P2Z4.png)

```javascript
var sorter = require('sorter');

sorter('#table-id')
  .on('sort', function (table, columnHeader, direction) {
    //table is the table element
    //column header is the `<th>` element
    //direction is either `'up'` or `'down'`
  })
  .on('clear', function (table) {
    //return to default sorting
  })
```

## API

### TableSorter(table, options)

```js
var TableSorter = require('sorter')
```

Add sorters to the `table`, which can either be a selector string that selects a single element, or an element.

`options` is an optional object with the following properties:

name        | type     | default               | description
------------|----------|-----------------------|--------------------------------------
th          | string   | `'th'`                | A selector, relative to the table element, for a collection of table headers (or an array of table headers)
sortControl | function | SVG up-down arrow     | This is a function that returns a `SortControl` when passed a table header and the options object.  If this is set, all options below this are ignored.
sorter      | string   | `'sorter'`            | A class to be added to the sorter
up          | string   | `'sorter-up'`         | A class to be added to the sorter when it is pointing up
down        | string   | `'sorter-down'`       | A class to be added to the sorter when it is pointing down
upArrow     | string   | `'sorter-up-arrow'`   | A class to be added to the sorter's up arrow
downArrow   | string   | `'sorter-down-arrow'` | A class to be added to the sorter's down arrow

The following CSS is also added to the page (and can be overriden in your own CSS)

```css
.sorter {
  width: 1em;
  height: 1em;
}
.sorter-down .sorter-up-arrow {
  display: none;
}
.sorter-up .sorter-down-arrow {
  display: none;
}
```

#### Events

Table sorter emits the following events:

 - sort
 - clear

Each get the `table` element as their first argument.  The `'sort'` event additionally gets the `ColumnHeader` and `Direction`.  The `Direction is a string and either `'up'` or `'down'`.

#### Methods

##### sort(th, direction, silent)

Update the table so that the given header is sorted in the given direction.  If no direction is provided this acts as a toggle.  If `silent` is `true`, the `'sort'` event is not emitted.

##### clear(silent)

Remove all sorting from the table.  If `silent` is `true`, the `'clear'` event is not emitted.

### SortControl

You can return a custom `SortControl` from the `sortControl` function to replace the default up-down arrow implementation.  It must have `up`, `down` and `clear` as methods.

For example, if you wanted to just have the text `(up)` and `(down)` instead of up and down arrows, you could try something like the following.

```js
var sorter = require('sorter')
function sortControl(th) {
  var el = null
  function up() {
    clear()
    el = document.createTextNode(' (up)')
    th.appendChild(el)
  }
  function down() {
    clear()
    el = document.createTextNode(' (down)')
    th.appendChild(el)
  }
  function clear() {
    if (el) {
      th.removeChild(el)
      el = null
    }
  }
  return {up: up, down: down, clear: clear}
}
sorter('#table-id', {sortControl: sortControl})
```

Note that if all you wanted to do was modify something like the colour, you'd be better off just adding some CSS using the default styles.

## License

  MIT

# sorter

  A sorter control for JavaScript (just a simple SVG up down arrow)

## Installation

    $ component install ForbesLindesay/sorter

## Guide

  Creates a simple svg image with three states:

  ![diagram of three states](http://i.imgur.com/2P2Z4.png)

  ```javascript
  var sorter = require('sorter');

  var all = sorter.appendToParent(document.getElementsByTagName('th'));

  function sortBy(id) {
    all.clear();
    //toggle state is still remembered after a clear
    sorter('#' + id + '.sorter').toggle();
  }
  ```

## API

  For the purposes of this API `elements` can be a selector string (e.g. `'#id.class-name'`), a single element (e.g. `document.getElementById('id')` or a sudo-array (e.g. `document.getElementsByClassName('class-name')`).

### sorter.appendToParent(elements)

  Appends a sorter SVG element to the `children` of each element in `elements` and returns an instance of `Sorter`.

### sorter(elements)

  Returns an instance of `Sorter` which controlls the `elements` provided, where elements are teh svg elements created by `sorter.appendToParent`.

### Sorter#up()

  Puts the sorter(s) in the `up` state.

### Sorter#down()

  Puts the sorter(s) in the `down` state.

### Sorter#clear()

  Resets the appearence of the sorter(s).

### Sorter#toggle()

  Toggles the sorter's state between `up` and `down` and returns the name of the end state.

## License

  MIT
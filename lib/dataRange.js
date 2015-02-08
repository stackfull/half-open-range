// © Copyright 2015 Paul Thomas <paul@stackfull.com>.
// MIT License http://www.opensource.org/licenses/mit-license.php
'use strict';

var Range = require('./range');

module.exports = DataRange;


function lengthIfExists(range) {
  return range ? range.length : 0;
}

function fillerArray(length) {
  return Array.apply(undefined, new Array(length));
}

// Manages the values of an range which acts as a window or view onto some
// wider sequence. This means that each value has an index into the .values
// array, but also an index into some up-stream array.
function DataRange() {
  this.values = [];
  this.range = Range.EMPTY;
}

DataRange.prototype = {
  constructor: DataRange,
  get: function(range) {
    var diff = this.range.difference(range);
    return fillerArray(lengthIfExists(diff.addToStart)).concat(
      this.values.slice(lengthIfExists(diff.removeFromStart),
                        this.range.length - lengthIfExists(diff.removeFromEnd)),
      fillerArray(lengthIfExists(diff.addToEnd)));
  },

  // Changes the range represented. The values will be shifted to fit and any
  // new values will be undefined.
  updateRange: function(newRange) {
    var diff = this.range.difference(newRange);
    this.range = newRange;
    if (diff.addToStart) {
      var filler = fillerArray(diff.addToStart.length);
      this.values = filler.concat(this.values);
    } else if (diff.removeFromStart) {
      this.values.splice(0, diff.removeFromStart.length);
    }
    if (diff.addToEnd) {
      var filler = fillerArray(diff.addToEnd.length);
      this.values = this.values.concat(filler);
    } else if (diff.removeFromEnd) {
      this.values.length -= diff.removeFromEnd.length;
    }
  },

  // Change the values relating to a sub-range. Only those values inside the
  // current range will be used.
  updateValues: function(subRange, newValues) {
    var s = subRange.intersection(this.range),
        v = typeof newValues === 'function' ? newValues : function(idx) {
          return newValues[idx - subRange.start];
        };
    s.forEach(function(i) {
      this.values[i - this.range.start] = v(i);
    }, this);
  },

  push: function() {
    if (arguments.length) {
      this.range = this.range.addAfter(arguments.length);
      this.values.push.apply(this.values, arguments);
    }
  },

  pop: function() {
    if (!this.range.length) {
      return undefined;
    }
    this.range = this.range.removeLast(1);
    return this.values.pop();
  },

  unshift: function() {
    if (arguments.length) {
      this.range = this.range.addBefore(arguments.length);
      this.values.unshift.apply(this.values, arguments);
    }
  },

  shift: function() {
    if (!this.range.length) {
      return undefined;
    }
    this.range = this.range.removeFirst(1);
    return this.values.shift();
  }
};


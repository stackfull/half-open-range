// © Copyright 2015 Paul Thomas <paul@stackfull.com>.
// MIT License http://www.opensource.org/licenses/mit-license.php
'use strict';

module.exports = Range;


var differencePrototype = {
  patch: function(add, remove) {
    add && this.addToStart && add(this.addToStart);
    add && this.addToEnd && add(this.addToEnd);
    remove && this.removeFromStart && remove(this.removeFromStart);
    remove && this.removeFromEnd && remove(this.removeFromEnd);
  }
};

var EMPTY;
var min = Math.min, max = Math.max;

// Simple half-open range value type.
function Range(start, end){
  if (!(this instanceof Range)) {
    return new Range(start, end);
  }
  if (arguments.length === 1) {
    return Range.apply(this, start);
  }
  if (start > end) {
    throw new Error("Range must start before it ends");
  }
  if (start === end) {
    if (EMPTY) {
      return EMPTY;
    } else {
      EMPTY = this;
      start = end = 0;
    } 
  }
  this.start = start;
  this.end = end;
  Object.defineProperty(this, 'length', {
    get: function() {
      return this.end - this.start;
    }
  });
  if (this.constructor === Range) {
    Object.freeze(this);
  }
}

Range.prototype = {
  constructor: Range,

  toString: function() {
    return "[" + this.start + ", " + this.end + ")";
  },

  before: function(count) {
    return new Range(this.start - count, this.start);
  },

  first: function(count) {
    return new Range(this.start, min(this.start + count, this.end));
  },

  last: function(count) {
    return new Range(max(this.start, this.end - count), this.end);
  },

  after: function(count) {
    return new Range(this.end, this.end + count);
  },

  intersects: function(other) {
    return this.start <= other.start ?
      this.end > other.start :
      other.end > this.start;
  },

  intersection: function(other) {
    return this.intersects(other) ?
      new Range(max(this.start, other.start),
                min(this.end, other.end)) :
      Range.EMPTY;
  },

  addBefore: function(count) {
    return new Range(this.start - count, this.end);
  },

  addAfter: function(count) {
    return new Range(this.start, this.end + count);
  },

  removeFirst: function(count) {
    var newStart = this.start + count;
    return new Range(newStart, max(newStart, this.end));
  },

  removeLast: function(count) {
    var newEnd = this.end - count;
    return new Range(min(this.start, newEnd), newEnd);
  },

  startsBefore: function(other) {
    return this.start < other.start;
  },

  endsAfter: function(other) {
    return this.end > other.end;
  },

  differenceBefore: function(other) {
    if (this.start >= other.start) {
      return Range.EMPTY;
    }
    return new Range(this.start, min(this.end, other.start));
  },

  differenceAfter: function(other) {
    if (this.end <= other.end) {
      return Range.EMPTY;
    }
    return new Range(max(this.start, other.end), this.end);
  },

  // Compute the difference between this range and an other.
  //
  // Returns an object containing the ranges to add or remove from the ends
  // of this range to create the other. This diff object also contains a
  // patch() method to apply the differences using actions provided.
  difference: function(other) {
    var diffs = Object.create(differencePrototype);
    if (other.startsBefore(this)) {
      diffs.addToStart = other.differenceBefore(this);
    } else if (this.startsBefore(other)) {
      diffs.removeFromStart = this.differenceBefore(other);
    }
    if (other.endsAfter(this)) {
      diffs.addToEnd = other.differenceAfter(this);
    } else if (this.endsAfter(other)) {
      diffs.removeFromEnd = this.differenceAfter(other);
    }
    return diffs;
  },

  forEach: function(cb, thisArg) {
    for (var idx = this.start; idx != this.end; idx++) {
      cb.call(thisArg, idx);
    }
  }
};

Range.EMPTY = new Range(0,0);

Range.create = function(start, end) {
  return new Range(start, end);
};



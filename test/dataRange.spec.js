// © Copyright 2015 Paul Thomas <paul@stackfull.com>.
// MIT License http://www.opensource.org/licenses/mit-license.php
'use strict';
var expect = require("chai").expect;


var DataRange = require('../lib/dataRange');
var Range = require('../lib/range');


describe("DataRange", function() {

  it("has a range and a values array", function() {
    var t = new DataRange();

    expect(t.range).to.be.an.instanceof(Range);
    expect(t.values).to.be.a('array');
  });

  describe("get", function() {
    var r; 
    beforeEach(function() {
      r = new DataRange;
      r.range = new Range(10, 15);
      r.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
    });
    it("returns an empty array for the empty range", function() {
      expect(r.get(Range.EMPTY)).to.eql([]);
    });
    
    it('returns all values for the matching range', function() {
      expect(r.get(Range.create(11, 13))).to.eql(['eleven', 'twelve']);
    });

    it('returns undefineds outside the current range', function() {
      expect(r.get(Range.create(8, 20))).to.eql(
        [ undefined, undefined, 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
          undefined, undefined, undefined, undefined, undefined]);
    });
  });

  describe("updateRange", function() {

    var t;

    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
    });

    it("updates the range", function() {
      t.updateRange(new Range(12, 17));

      expect(t.range).to.eql(new Range(12, 17));
    });

    it("updates the values", function() {
      t.updateRange(new Range(12, 17));

      expect(t.values).to.eql(['twelve', 'thirteen', 'fourteen', undefined, undefined]);
    });

    it("updates the values", function() {
      t.updateRange(new Range(8, 12));

      expect(t.values).to.eql([undefined, undefined, 'ten', 'eleven']);
    });
  });

  describe("updateValues", function() {

    var t;
    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
    });

    it("updates the values at the right place", function() {
      t.updateValues(new Range(11, 13), ['ELEVEN', 'TWELVE']);

      expect(t.values).to.eql(['ten', 'ELEVEN', 'TWELVE', 'thirteen', 'fourteen']);
    });

    it("clips update to current range", function() {
      t.updateValues(new Range(8, 13), ['EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE']);

      expect(t.values).to.eql(['TEN', 'ELEVEN', 'TWELVE', 'thirteen', 'fourteen']);
    });

    it("accepts a function", function() {
      t.updateValues(new Range(11, 13), function(idx){ return ''+idx; });

      expect(t.values).to.eql(['ten', '11', '12', 'thirteen', 'fourteen']);
    });

    it("clips and accepts a function", function() {
      t.updateValues(new Range(13, 20), function(idx){ return ''+idx; });

      expect(t.values).to.eql(['ten', 'eleven', 'twelve', '13', '14']);

    });

  });

  describe("push", function() {
    var t;
    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
      t.push('FIFTEEN', 'SIXTEEN');
    });

    it("updates the range", function() {
      expect(t.range).to.eql(new Range(10, 17));
    });

    it("updates the values at the right place", function() {
      expect(t.values).to.eql(['ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
                              'FIFTEEN', 'SIXTEEN']);
    });
  });

  describe("unshift", function() {
    var t;
    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
      t.unshift('EIGHT', 'NINE');
    });

    it("updates the range", function() {
      expect(t.range).to.eql(new Range(8, 15));
    });

    it("updates the values at the right place", function() {
      expect(t.values).to.eql(['EIGHT', 'NINE',
                              'ten', 'eleven', 'twelve', 'thirteen', 'fourteen']);
    });

  });

  describe("pop", function() {
    var t;
    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
    });

    it("returns undefined on empty range", function() {
      var r = new DataRange();
      expect(r.pop()).to.not.exist;
    });

    it("returns the last value", function() {
      expect(t.pop()).to.be.eql('fourteen');
    });

    it("removes the last value", function() {
      t.pop();

      expect(t.values).to.eql(['ten', 'eleven', 'twelve', 'thirteen']);
    });

    it("reduces the range", function() {
      t.pop();

      expect(t.range).to.eql(Range.create(10,14));
    });
  });

  describe("shift", function() {
    var t;
    beforeEach(function() {
      t = new DataRange();
      t.range = new Range(10, 15);
      t.values = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen'];
    });

    it("returns undefined on empty range", function() {
      var r = new DataRange();
      expect(r.shift()).to.not.exist;
    });

    it("returns the first value", function() {
      expect(t.shift()).to.be.eql('ten');
    });

    it("removes the first value", function() {
      t.shift();

      expect(t.values).to.eql(['eleven', 'twelve', 'thirteen', 'fourteen']);
    });

    it("reduces the range", function() {
      t.shift();

      expect(t.range).to.eql(Range.create(11,15));
    });
  });
});

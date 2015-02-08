// © Copyright 2015 Paul Thomas <paul@stackfull.com>.
// MIT License http://www.opensource.org/licenses/mit-license.php
'use strict';

var chai = require("chai");
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var Range = require('../lib/range');


describe("Range", function() {

  it("has a 'start' and an 'end'", function() {
    var r = new Range(23, 45);

    expect(r.start).to.equal(23);
    expect(r.end).to.equal(45);
  });

  it("has a string represenation as a half-open range", function() {
    var r = new Range(23, 45);

    expect(r.toString()).to.equal("[23, 45)");
  });

  it("can be created from an array", function() {
    var r = new Range([23, 45]);

    expect(r.start).to.equal(23);
    expect(r.end).to.equal(45);
  });

  it("can be created by factory", function() {
    var r = Range.create(11, 22);

    expect(r).to.eql(new Range(11, 22));
  });

  it("protects against forgotten 'new'", function() {
    /*jshint nonew:false */
    var r = Range(11, 22);

    expect(r).to.eql(new Range(11, 22));
  });

  it("protects against start > end", function() {
    expect(function() { return new Range(40, 39); }).to.throw(Error);
  });

  it("has a length property", function() {
    var r = Range.create(333, 333+24);

    expect(r.length).to.equal(24);
  });

  describe("startsBefore", function() {
    it("is true if A.start is before B.start", function() {
      var target = new Range(23, 45);

      expect(target.startsBefore(new Range(24,25))).to.be.ok;
      expect(target.startsBefore(new Range(24,44))).to.be.ok;
      expect(target.startsBefore(new Range(24,45))).to.be.ok;
      expect(target.startsBefore(new Range(24,46))).to.be.ok;
      expect(target.startsBefore(new Range(24,50))).to.be.ok;
      expect(target.startsBefore(new Range(49,50))).to.be.ok;
    });

    it("is false if A.start is equal to B.start", function() {
      var target = new Range(23, 45);

      expect(target.startsBefore(new Range(23,25))).to.be.not.ok;
      expect(target.startsBefore(new Range(23,44))).to.be.not.ok;
      expect(target.startsBefore(new Range(23,45))).to.be.not.ok;
      expect(target.startsBefore(new Range(23,46))).to.be.not.ok;
      expect(target.startsBefore(new Range(23,50))).to.be.not.ok;
    });

    it("is false if A.start is after B.start", function() {
      var target = new Range(23, 45);

      expect(target.startsBefore(new Range(20,22))).to.be.not.ok;
      expect(target.startsBefore(new Range(20,23))).to.be.not.ok;
      expect(target.startsBefore(new Range(20,24))).to.be.not.ok;
      expect(target.startsBefore(new Range(22,23))).to.be.not.ok;
      expect(target.startsBefore(new Range(22,24))).to.be.not.ok;
      expect(target.startsBefore(new Range(22,50))).to.be.not.ok;
    });
  });

  describe("endsAfter", function() {
    it("is true if A.end is after B.end", function() {
      var target = new Range(23, 45);

      expect(target.endsAfter(new Range(20,21))).to.be.ok;
      expect(target.endsAfter(new Range(23,24))).to.be.ok;
      expect(target.endsAfter(new Range(24,25))).to.be.ok;
      expect(target.endsAfter(new Range(43,44))).to.be.ok;
    });

    it("is false if A.end is equal to B.end", function() {
      var target = new Range(23, 45);

      expect(target.endsAfter(new Range(20,45))).to.be.not.ok;
      expect(target.endsAfter(new Range(23,45))).to.be.not.ok;
      expect(target.endsAfter(new Range(44,45))).to.be.not.ok;
    });

    it("is false if A.end is before B.end", function() {
      var target = new Range(23, 45);

      expect(target.endsAfter(new Range(20,46))).to.be.not.ok;
      expect(target.endsAfter(new Range(23,46))).to.be.not.ok;
      expect(target.endsAfter(new Range(24,46))).to.be.not.ok;
      expect(target.endsAfter(new Range(46,50))).to.be.not.ok;
    });
  });

  describe("differenceBefore", function(){

    it("returns all elements from A if A < B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(50, 100))).to.eql(A);
    });

    it("returns all elements from A if A m B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(45, 100))).to.eql(A);
    });

    it("returns partal elements from A if A o B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(30, 100))).to.eql(new Range(23, 30));
    });

    it("returns partal elements from A if A fi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(30, 45))).to.eql(new Range(23, 30));
    });

    it("returns partal elements from A if A di B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(30, 32))).to.eql(new Range(23, 30));
    });

    it("returns the empty range if A s B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(23, 50))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A si B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(23, 39))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A d B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(20, 500))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A f B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(9, 45))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A oi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(5, 34))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A mi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(20, 23))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A > B", function() {
      var A = new Range(23, 45);
      expect(A.differenceBefore(new Range(1, 2))).to.eql(Range.EMPTY);
    });
  });

  describe("differenceAfter", function(){

    it("returns all elements from A if A > B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(3, 10))).to.eql(A);
    });

    it("returns the empty range if A < B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(50, 5000))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A m B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(45, 200))).to.eql(Range.EMPTY);
    });

    it("returns all elements from A if A mi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(11, 23))).to.eql(A);
    });

    it("returns the empty range if A o B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(34, 600))).to.eql(Range.EMPTY);
    });

    it("returns partal elements from A if A oi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(22, 30))).to.eql(new Range(30, 45));
    });

    it("returns the empty range if A s B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(23, 50))).to.eql(Range.EMPTY);
    });

    it("returns partial range if A si B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(23, 40))).to.eql(new Range(40, 45));
    });

    it("returns the empty range if A d B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(20, 500))).to.eql(Range.EMPTY);
    });

    it("returns partial range if A di B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(35, 38))).to.eql(new Range(38, 45));
    });

    it("returns the empty range if A f B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(10, 45))).to.eql(Range.EMPTY);
    });

    it("returns the empty range if A fi B", function() {
      var A = new Range(23, 45);
      expect(A.differenceAfter(new Range(44, 45))).to.eql(Range.EMPTY);
    });
  });

  describe("A.difference(B)", function() {

    it("returns expected difference when A < B", function() {
      var a = new Range(5, 20),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.eql(a);
      expect(d.addToEnd).to.eql(b);
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A > B", function() {
      var b = new Range(5, 20),
          a = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.eql(b);
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.eql(a);
    });

    it("returns expected difference when A m B", function() {
      var a = new Range(5, 40),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.eql(a);
      expect(d.addToEnd).to.eql(b);
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A mi B", function() {
      var a = new Range(55, 100),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.eql(b);
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.eql(a);
    });

    it("returns expected difference when A o B", function() {
      var a = new Range(5, 50),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.eql(Range.create(5, 40));
      expect(d.addToEnd).to.eql(Range.create(50, 55));
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A oi B", function() {
      var a = new Range(50, 100),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.eql(new Range(40, 50));
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.eql(new Range(55, 100));
    });

    it("returns expected difference when A s B", function() {
      var a = new Range(40, 50),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.eql(new Range(50, 55));
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A si B", function() {
      var a = new Range(40, 60),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.eql(new Range(55, 60));
    });

    it("returns expected difference when A d B", function() {
      var a = new Range(44, 51),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.eql(new Range(40, 44));
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.eql(new Range(51, 55));
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A di B", function() {
      var a = new Range(30, 60),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.eql(new Range(30, 40));
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.eql(new Range(55, 60));
    });

    it("returns expected difference when A f B", function() {
      var a = new Range(50, 55),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.eql(new Range(40, 50));
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A fi B", function() {
      var a = new Range(5, 55),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.eql(new Range(5, 40));
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.not.exist();
    });

    it("returns expected difference when A = B", function() {
      var a = new Range(40, 55),
          b = new Range(40, 55),
          d = a.difference(b);

      expect(d.addToStart).to.not.exist();
      expect(d.removeFromStart).to.not.exist();
      expect(d.addToEnd).to.not.exist();
      expect(d.removeFromEnd).to.not.exist();
    });

    describe(".patch()", function() {

      var add, remove;

      beforeEach(function() {
        add = sinon.spy();
        remove = sinon.spy();
      });

      it("calls expected patch methods when A < B", function() {
        var a = new Range(5, 20),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(a);
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(b);
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A > B", function() {
        var b = new Range(5, 20),
        a = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(a);
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(b);
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A m B", function() {
        var a = new Range(5, 40),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(a);
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(b);
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A mi B", function() {
        var a = new Range(55, 100),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(a);
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(b);
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A o B", function() {
        var a = new Range(5, 50),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(Range.create(5, 40));
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(Range.create(50, 55));
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A oi B", function() {
        var a = new Range(50, 100),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).to.have.been.calledWith(Range.create(55, 100));
        expect(remove).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(Range.create(40, 50));
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A s B", function() {
        var a = new Range(40, 50),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).not.to.have.been.called;
        expect(add).to.have.been.calledWith(Range.create(50, 55));
        expect(add).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A si B", function() {
        var a = new Range(40, 60),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(add).not.to.have.been.called;
        expect(remove).to.have.been.calledWith(Range.create(55, 60));
        expect(remove).to.have.been.calledOnce;
      });

      it("calls expected patch methods when A d B", function() {
        var a = new Range(44, 51),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).not.to.have.been.called;
        expect(add).to.have.been.calledWith(Range.create(40, 44));
        expect(add).to.have.been.calledWith(Range.create(51, 55));
        expect(add).to.have.been.calledTwice;
      });

      it("calls expected patch methods when A di B", function() {
        var a = new Range(30, 60),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(add).not.to.have.been.called;
        expect(remove).to.have.been.calledWith(Range.create(30, 40));
        expect(remove).to.have.been.calledWith(Range.create(55, 60));
        expect(remove).to.have.been.calledTwice;
      });

      it("calls expected patch methods when A f B", function() {
        var a = new Range(50, 55),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(remove).not.to.have.been.called;
        expect(add).to.have.been.calledOnce;
        expect(add).to.have.been.calledWith(Range.create(40, 50));
      });

      it("calls expected patch methods when A fi B", function() {
        var a = new Range(5, 55),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(add).not.to.have.been.called;
        expect(remove).to.have.been.calledOnce;
        expect(remove).to.have.been.calledWith(Range.create(5, 40));
      });

      it("calls expected patch methods when A = B", function() {
        var a = new Range(40, 55),
        b = new Range(40, 55),
        d = a.difference(b);
        d.patch(add, remove);

        expect(add).not.to.have.been.called;
        expect(remove).not.to.have.been.called;
      });

    });
  });

  describe("forEach", function() {

    it("does nothing for the empty range", function() {
      Range.EMPTY.forEach(function(){ expect(true).to.be.false });
    });

    it("calls a callback in order", function() {
      var x = 12;
      var r = new Range(12, 15);

      r.forEach(function(idx) {
        expect(idx).to.equal(x);
        x += 1;
      });
      expect(x).to.equal(15);
    });

  });

  describe("first()", function() {

    it("returns the empty range for 0", function(){
      expect(Range.create(10, 20).first(0)).to.eql(Range.EMPTY);
    });

    it("returns a range of the first N", function() {
      expect(Range.create(10, 20).first(5)).to.eql(Range.create(10, 15));
    });

    it("clips to the range", function() {
      expect(Range.create(10, 20).first(50)).to.eql(Range.create(10, 20));
    });
  });

  describe("last()", function() {

    it("returns the empty range for 0", function(){
      expect(Range.create(10, 20).last(0)).to.eql(Range.EMPTY);
    });

    it("returns a range of the last N", function() {
      expect(Range.create(10, 20).last(5)).to.eql(Range.create(15, 20));
    });

    it("clips to the range", function() {
      expect(Range.create(10, 20).last(50)).to.eql(Range.create(10, 20));
    });
  });

  describe("before()", function() {

    it("returns the empty range for 0", function(){
      expect(Range.create(10, 20).before(0)).to.eql(Range.EMPTY);
    });

    it("returns a range of the N before this", function() {
      expect(Range.create(10, 20).before(5)).to.eql(Range.create(5, 10));
    });
  });

  describe("after()", function() {

    it("returns the empty range for 0", function(){
      expect(Range.create(10, 20).after(0)).to.eql(Range.EMPTY);
    });

    it("returns a range of the N after this", function() {
      expect(Range.create(10, 20).after(5)).to.eql(Range.create(20, 25));
    });
  });

  describe("intersection()", function() {

    it("returns the empty range for the empty range", function(){
      var A = Range.create(10, 20);
      expect(A.intersection(Range.EMPTY)).to.eql(Range.EMPTY);
      expect(Range.EMPTY.intersection(A)).to.eql(Range.EMPTY);
    });

    it("returns the empty range for non-intersecting ranges", function(){
      var A = Range.create(10, 20),
          B = Range.create(40, 120);
      expect(A.intersection(B)).to.eql(Range.EMPTY);
      expect(B.intersection(A)).to.eql(Range.EMPTY);
    });

    it( "returns the common range for two intersecting ranges", function() {
      var A = Range.create(10, 30),
          B = Range.create(25, 140),
          C = Range.create(25, 30);
      expect(A.intersection(B)).to.eql(C);
      expect(B.intersection(A)).to.eql(C);
    });
  });

  describe("addBefore()", function() {

    it( "returns the same for 0", function() {
      var A = Range.create(10, 30);
      expect(A.addBefore(0)).to.eql(A);
    });

    it( "returns a longer range", function() {
      expect(Range.create(10, 30).addBefore(3)).to.eql(Range.create(7, 30));
    });
  });

  describe("addAfter()", function() {

    it( "returns the same for 0", function() {
      var A = Range.create(10, 30);
      expect(A.addAfter(0)).to.eql(A);
    });

    it( "returns a longer range", function() {
      expect(Range.create(10, 30).addAfter(3)).to.eql(Range.create(10, 33));
    });
  });

  describe("removeFirst()", function() {

    it( "returns the same for 0", function() {
      var A = Range.create(10, 30);
      expect(A.removeFirst(0)).to.eql(A);
    });

    it( "returns a shorter range", function() {
      expect(Range.create(10, 30).removeFirst(3)).to.eql(Range.create(13, 30));
    });
  });

  describe("removeLast()", function() {

    it( "returns the same for 0", function() {
      var A = Range.create(10, 30);
      expect(A.removeLast(0)).to.eql(A);
    });

    it( "returns a shorter range", function() {
      expect(Range.create(10, 30).removeLast(3)).to.eql(Range.create(10, 27));
    });
  });

});

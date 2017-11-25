
var expect = require('chai').expect;
var container = require("../container.js");
var signTypes = require('../signTypes.js');

describe('Road-Sign Storage', function () {

    it('Simple posts to server should add the observation', function () {
    
    const roadSigns = new container();
    roadSigns.debug = true;

    roadSigns.putSign(42.470483, -83.408274, '1', signTypes[0]);
    expect(roadSigns.count).to.be.equal(1);
    roadSigns.putSign(42.459600, -83.394249, '1', signTypes[0]);
    expect(roadSigns.count).to.be.equal(2);
    roadSigns.putSign(42.469777, -83.430600, '2', signTypes[1]);
    expect(roadSigns.count).to.be.equal(3);
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);
    expect(roadSigns.count).to.be.equal(4);
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);    // Duplicate observation
    expect(roadSigns.count).to.be.equal(4);

  });

  it('Should Add and Retrieve road-sign details', function () {
    
    const roadSigns = new container();
    roadSigns.debug = true;

    roadSigns.putSign(42.470483, -83.408274, '1', signTypes[0]);
    roadSigns.putSign(42.459600, -83.394249, '1', signTypes[0]);
    roadSigns.putSign(42.469777, -83.430600, '2', signTypes[1]);    // Out of range
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);    // Duplicate observation
    var result = roadSigns.getSignsInRange(42.469777, -83.398697, 2);

    expect(result.length).to.be.equal(3);

  });

  it('Should Add and Retrieve sign types', function () {
    
    const roadSigns = new container();
    roadSigns.debug = false;

    roadSigns.putSign(42.470483, -83.408274, '1', signTypes[0]);
    roadSigns.putSign(42.459600, -83.394249, '1', signTypes[0]);
    roadSigns.putSign(42.469777, -83.430600, '2', signTypes[1]);    // Out of range
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);
    roadSigns.putSign(42.474324, -83.390257, '3', signTypes[2]);    // Duplicate observation
    var result = roadSigns.getSignsInRange(42.469777, -83.398697, 2);
    result = result.toArray();

    expect(result.length).to.be.equal(2);
    expect(result).to.include.members([signTypes[0], signTypes[2]]);
    expect(result).to.not.include.members([signTypes[1]]);
  });
});
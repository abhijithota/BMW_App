const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var events = require('events');
var HashMap = require('hashmap');
var HashSet = require('hashset');
var sign = require("./sign.js");
var container = require("./container.js");
const signTypes = require('./signTypes.js');
const eventEmitter = new events.EventEmitter();
const signContainer = new container();
const app = express();
const appUser = express();



/* event handlers and specifiers for post road-sign operation */
var addSign = function addSign(lat, lon, signtype) {
  //console.log(signtype, " ", parseInt(signtype));
  signContainer.putSign(parseFloat(lat), parseFloat(lon), parseInt(signtype), signTypes[parseInt(signtype)-1]);
}
eventEmitter.on('AddSign', addSign);


/* validating function for road-sign parameters in post request */
function postInputValid(lat, lon) {
  // Checking for sanity of latitude value
  if(isNaN(lat))
    return 'Latitude is not in numerical format';
  else
  {
    var latVal = parseFloat(lat);
    if((latVal < -90) || (latVal > 90))
      return 'Latitude value should lie within -90.0 and 90.0 degrees';
  }

  // Checking for sanity of longitude value
  if(isNaN(lon))
    return 'Longitude is not in numerical format';
  else
  {
    var lonVal = parseFloat(lon);
    if((lonVal < -180) || (lonVal > 180))
      return 'Longitude value should lie within -180.0 and 180.0 degrees';
  }

  return null;
}


/* validating function for location and radius of the region in get request */
function getInputValid(lat, lon, rad) {
  
  // Checking for sanity of latitude and longitude value
  var checkLatLon = postInputValid(lat, lon);
  if(checkLatLon != null)
    return checkLatLon;

  // Checking for sanity of radius value
  if(isNaN(rad))
    return 'Radius is not in numerical format';
  else
  {
    if(parseInt(rad) <= 0)
      return 'Radius should be a positive integer';
  }

  return null;
}






/*******   SERVER SETUP   **********/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

appUser.use(express.static('public'));
appUser.use(bodyParser.urlencoded({ extended: true }));
appUser.set('view engine', 'ejs');



/*******   SERVER URIs   **********/

/* GET main page */
app.get('/', function (req, res) {
  res.render('index', {signTypes: signTypes, addSignMessage: null, addSignError: null, error: null, resultsigns: null});
})

/* GET signs in specified region */
app.get('/aresigns', function (req, res) {

  // Validate parameters
  var signsInRange = null;
  var errorString = getInputValid(req.query.lat, req.query.lon, req.query.rad);

  // Find signs in region and respond with list of road-signs and their details
  if(errorString == null)
  {
    signContainer.debug = true;
    signsInRange = signContainer.getSignsInRange(parseFloat(req.query.lat), parseFloat(req.query.lon), parseInt(req.query.rad));
    signContainer.debug = false;
  }

  res.render('index', {signTypes: signTypes, addSignMessage: null, addSignError: null, error: errorString, resultsigns: signsInRange});
})

/* POST add new road-sign observation */
app.post('/', function (req, res) {

  // Validate parameters
  var addError = postInputValid(req.body.lat, req.body.lon);
  var addedMessage = null;

  // Emit event to process add the observed road-sign
  if(addError == null)
  {
    addedMessage = "Added the sign";
    eventEmitter.emit('AddSign', req.body.lat, req.body.lon, req.body.signtype);
  }

  // Respond with new road-sign count
  res.render('index', {signTypes: signTypes, addSignMessage: addedMessage, addSignError: addError, error: null, resultsigns: null});
})



/* GET main page for End-User */
appUser.get('/', function (req, res) {
  res.render('result', {resultSigns: null, error: null});
})

// GET signs hash list
appUser.get('/findsigns', function (req, res) {

  // Validate parameters
  var signsInRange = null;
  var errorString = getInputValid(req.query.lat, req.query.lon, req.query.rad);

  // Find signs in region and respond with list of unique road-sign types in region
  if(errorString == null)
  {
    signContainer.debug = false;
    signsInRange = signContainer.getSignsInRange(parseFloat(req.query.lat), parseFloat(req.query.lon), parseInt(req.query.rad));
    
    if(signsInRange != null)
      signsInRange = signsInRange.toArray();
  }

  res.render('result', {resultSigns: signsInRange, error: errorString});
})




/*******   SERVER START   **********/
app.listen(3000, function () {
  console.log('Road-Sign app listening on port 3000!')
})

appUser.listen(4007, function () {
  console.log('End-User app listening on port 4007!')
})
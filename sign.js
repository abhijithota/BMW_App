var geolib = require('geolib');

let id = 0;

class Sign {
  constructor(lat, lon, type, typeName) {
    this.id = ++id;
    this._lat = lat;
    this._lon = lon;
    this._type = type;
    this._typeName = typeName;
  }

  // Latitude field
  get latitude() {
    return this._lat;
  }

  // Longitude field
  get longitude() {
    return this._lon;
  }

  // Type field
  get type() {
    return this._type;
  }

  // Type Name field
  get typeName() {
    return this._typeName;
  }


  /* 
   * Check if this sign falls within the radius of incoming latitude and longitude fall 
   */
  isInRadius(inLat, inLon, rad) {

    var distance = geolib.getDistance({latitude: inLat, longitude: inLon}, {latitude: this._lat, longitude: this._lon});

    //console.log(this.id, " ", this._lat, " ", this._lon, " ", distance);
    if(distance > (rad*1000))
      return false;

    return true;
    
  }
}

module.exports = Sign;
var HashMap = require('hashmap');
var HashSet = require('hashset');
var sign = require("./sign.js");
const latMap = new HashMap();

class Container {
  constructor() {
    this._signCount = 0;
    this._debug = false
  }

  /* Debug flag to either return road-signs details (for debugging) or road-sign types */
  set debug(val) {
    this._debug = val;
  }

  /* Count field to store the total number of observations posted yet */
  get count() {
    return this._signCount;
  }

  _checkIfSame(lat, lon, type, signObj)
  {
    if( (signObj.latitude ==lat) &&
        (signObj.longitude == lon) &&
        (signObj.type == type) )
      return true;

    return false;
  }

  _checkForDuplicate(lat, lon, type, signList)
  {
    for(var i=0; i<signList.length; i++)
    {
      var signObj = signList[i];
      if(this._checkIfSame(lat, lon, type, signObj))
        return true;
    }

    return false;
  }

/*
 * To get all the signs in the specified region, we first find the base lat and lon 
 * bucket (of 1 degree range) where the region lies. We then try to check if there are road-signs
 * in the surrounding blocks (adjacent buckets) while the bucketed region is within the radius.
 * As per geography, a 1 degree lat and lon would be max 112 KM near the equator. Thus, we span out
 * with the buckets to the maximum on both directions for lat and lon while they lie within the radius
 * range.
 */
  getSignsInRange(lat, lon, rad) {

    // Get the keys for lat and lon HashMaps for this region
    var baseLat = Math.floor(lat);
    var baseLon = Math.floor(lon);

    // Resolution of radius is 1 KM. 1 degree of lat or lon is 112 KM max.
    // So for every 112 KM of radius, we search 1 adjacent bucket further.
    var radRange = Math.ceil(rad/112);

    // Based on the debug flag, we either create a list of road-sign details  or a HashSet of road-sign types
    var resultSigns;
    if(this._debug)
      resultSigns = new Array();
    else
      resultSigns = new HashSet();

    // Iterate over valid Latitude buckets in range
    for(var iLat=baseLat-radRange; iLat<=baseLat+radRange; iLat++)
    {
      if(!latMap.has(iLat))
        continue;

      // Iterate over valid Longitude buckets in range
      var lonMap = latMap.get(baseLat);
      for(var iLon=baseLon-radRange; iLon<=baseLon+radRange; iLon++)
      {
        if(!lonMap.has(iLon))
          continue;

        // Get the list of road-signs in bucket and check if the sign is within radius
        var signList = lonMap.get(iLon);
        for(var i=0; i<signList.length; i++)
        {
          var signObj = signList[i];
          if(signObj.isInRadius(lat, lon, rad))
          {
            if(this._debug)
              resultSigns.push(signObj);
            else
              resultSigns.add(signObj.typeName);
            //console.log("FOUND");
            //console.log(signObj);
          }
        }
      }
    }

    return resultSigns;
  }

/*
 * The observed road-signs are stored in a 2 level HashMap with every entry corresponding
 * to a bucket of 1 degree latitude or longitude. Based on the latitude and longitude value 
 * of the incoming road-sign, we find the right buckets at both level for it and add it to 
 * the list if it is a unique observation
 */

  putSign(lat, lon, type, typeName) {

    // Get bucket keys for the observation
    var baseLat = Math.floor(lat);
    var baseLon = Math.floor(lon);

    // get list of corresponding lat
    if(!latMap.has(baseLat))
    {
      latMap.set(baseLat, new HashMap());
    }
    var lonMap = latMap.get(baseLat);

    // get list of corresponding signs
    if(!lonMap.has(baseLon))
    {
      lonMap.set(baseLon, new Array());
    }
    var signList = lonMap.get(baseLon);

    // add to sign list if this sign has not yet been observed
    if(!this._checkForDuplicate(lat, lon, type, signList))
    {
      signList.push(new sign(lat, lon, type, typeName));
      this._signCount++;
    }

    //console.log(" ADDED? ", baseLat, baseLon);
    //console.log(latMap.get(baseLat).get(baseLon)[signList.length-1]);
  }
}

module.exports = Container;
// function group(features){
//   var feature, coordinates, type;
//   var typePrev;
//   var results = [[]], joinCoord = results[0];
//   var lastPt;
//   // autoReverseArray(arr, lastPt).
//   for(var i in features){
//     feature = features[i];
//     coordinates = feature.geometry.coordinates;
//     if(lastPt){
//       coordinates = autoReverseArray(coordinates, lastPt);
//     }

//     lastPt = coordinates[coordinates.length - 1];
//     type = feature.properties.DIR;
//     typePrev = typePrev || type;
//     //
//     if(typePrev !== type){
//       joinCoord = [];
//       results.push(joinCoord);
//     }
//     for(var i = 1; i < coordinates.length; i++){
//       joinCoord.push(coordinates[i]);
//     }
//     typePrev = type;
//   }
//   return results
// }

function sub(v1, v2) {
  if (!v1 || !v2) return;
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function add(v1, v2) {
  if (!v1 || !v2) return;
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function multipyByScalar(v, d) {
  if (!v) return;
  return [v[0] * d, v[1] * d];
}

function getOffsetDashedFeatures(groups, distance) {
  var group, pt;
  var lastPt;
  for (var i in groups) {
    group = groups[i];
    var isFirst = true;
    var gLength = group.length;
    //
    if (gLength < 2) continue;
    //
    var offsets = [],
      offset;
    var pOffset;
    for (var j = 0; j < gLength; j++) {
      pt = group[j];
      ptNext = group[j + 1];
      ptPrev = group[j - 1];
      offset = getOffset(ptPrev, pt, ptNext, distance);
      if (!offset[0] || !offset[1]) offset = pOffset || offset;
      offsets.push(offset);
      pOffset = offset;
    };
    //
    for (var j = gLength - 1; j >= 0; j--) {
      pt = group[j];
      offset = offsets[j];
      pt[0] += (offset[0] || 0);
      pt[1] += (offset[1] || 0);
    }
    //
  }
}

function normalize(v) {
  if (!v) return [0, 0];
  var x = v[0];
  var y = v[1];
  var l = Math.sqrt(x * x + y * y);
  return [x / l, y / l];
}

function getOffset(ptPrev, pt, ptNext, distance) {
  var vNext, vPrev;
  vNext = sub(ptNext, pt), vPrev = sub(pt, ptPrev);
  if (!vNext || !vPrev) return getFirstOrLastOffset(normalize(vNext || vPrev), distance);
  //
  vNext = normalize(vNext);
  vNext = getVerticalVector(vNext);
  vPrev = normalize(vPrev);
  vPrev = getVerticalVector(vPrev);
  var v = add(vNext, vPrev);
  v = normalize(v);
  return multipyByScalar(v, distance);
}

function reverseArray(arr) {
  var newArr = [];
  for (var i = arr.length - 1; i >= 0; i--) {
    newArr.push(arr[i]);
  }
  return newArr;
}

function autoReverseArray(arr, lastPt) {
  if (!lastPt) return arr;
  var firstPt = arr[0];
  var llastPt = arr[arr.length - 1];
  var disFirst = Math.abs(firstPt[0] - lastPt[0]) + Math.abs(firstPt[1] - lastPt[1]);
  var disLast = Math.abs(llastPt[0] - lastPt[0]) + Math.abs(llastPt[1] - lastPt[1]);
  if (disFirst > disLast) return reverseArray(arr);
  return arr;
}


function getFirstOrLastOffset(v, distance) {
  return [v[1] * distance, -v[0] * distance];
}

function getVerticalVector(v) {
  return [v[1], -v[0]];
}

function clone(crv) {
  return JSON.parse(JSON.stringify(crv));
}


function getOffsetGeojson(geojson, offset, zoom) {
  geojson = clone(geojson);
  var features = geojson.features;
  var newArr = [];
  var indexx = 0;
  for (var i in features) {
    newArr.push(features[i].geometry.coordinates)
  }
  getOffsetDashedFeatures(newArr, offset);
  return geojson;
}

module.exports = {
  getOffsetDashedFeatures: getOffsetDashedFeatures,
  getOffsetGeojson: getOffsetGeojson
};
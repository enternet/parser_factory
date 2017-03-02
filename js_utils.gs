//
// убираем вложенные хэши, делаем объект одноуровневым
//

function make_plain_json(src_json) {
  var result = {};
  var processeed = false;

  processeed = false;
  for (var k in src_json) {
    var v = src_json[k];
    if (Array.isArray(v)) {
      result[k] = [];
      for (var i = 0; i < v.length; i++) {
        if (isObject(v[i]) && !Array.isArray(v[i])) {
          result[k][i] = make_plain_json(v[i]);
        } else {
          result[k][i] = v[i];
        }
      }
    } else if (isObject(v)) {
      for(var subkey in v) {
        result[k + "." + subkey] = v[subkey];
      }
      processeed = true;
    } else {
      result[k] = v;
    }
  }
  
  if (processeed) {
    result = make_plain_json(result);
  }
    
  return result;
}

function test_make_plain_json() {
  var a  = {
    "a": [{}, {
      "c": 2,
      "d": {
        "e": "3"
      }
    }],
    "b": {
      "c": 2,
      "d": {
        "e": "3"
      }
    }
  }
  
  //Logger.log(a);
  Logger.log(make_plain_json(a));
}

//
//
//

function isObject(obj) {
   return obj && (typeof obj  === "object");
}

function extend(destination, source) {
  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      destination[property] = source[property];
    }
  }
  return destination;
};

function union(A, B, C) {
  var result = {};
  extend(result, A);
  extend(result, B);
  extend(result, C);
  return result;
};

function except(A, B) {
  var result = {};
  
  if (Array.isArray(B)) {
    for (var property in A) {
      if (A.hasOwnProperty(property) && B.indexOf(property) < 0) {
        result[property] = A[property];
      }
    }
  } else {
    for (var property in A) {
      if (A.hasOwnProperty(property) && !B.hasOwnProperty(property)) {
        result[property] = A[property];
      }
    }
  }
  
  return result;
};

//
//
//

function dateFromXmlString(s) {
  var bits = s.split(/[-T:.]/g);
  var d = new Date(bits[0], bits[1] - 1, bits[2]);
  if (bits.length >= 4) {
    d.setHours(bits[3]);
  } else if (bits.length >= 5) {
    d.setHours(bits[3], bits[4]);
  } else if (bits.length >= 6) {
    d.setHours(bits[3], bits[4], bits[5]);
  } else if (bits.length >= 7 && bits[6].length >= 3) {
    d.setHours(bits[3], bits[4], bits[5], bits[6]);
  }
  return d;
}

//
//
//

function logger(object) {
  Logger.log(object)
  return object;
}

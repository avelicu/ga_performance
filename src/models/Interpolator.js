function interpolate3d(data, key, x, y) {
    if (key == null || x == null || y == null) {
        return null;
    }
    
    return _interpolate(
        Object.keys(data),
        key,
        i => interpolate2d(data[i], x, y));
}

function interpolate2d(data, key, x) {
     if (key == null || x == null) {
         return null;
     }
     
     // First interpolate keys within data's keys, then
     // interpolate x within the value at each interpolated key.
     return _interpolate(
        Object.keys(data),
        key,
        i => interpolate(data[i], x));
 }

function interpolate(data, x) {
    if (x == null) {
        return null;
    }
    
    return _interpolate(
        Object.keys(data),
        x,
        i => data[i]);
 }
 
 // Searches for `x` within `data`, using `value_getter`
 // to obtain the `y1`, `y2` value for any given key, then interpolates
 // between the `y1`, `y2` values for the two `x1`, `x2` values closest to
 // the sought `x`.
 //
 // For example, if the keys of `data` are [ 0, 10, 20 ]
 // and the sought x is 5, this method will find the positions x1=0 and x2=10,
 // call `value_getter(0)` and `value_getter(10)` to obtain the values y1 and y2,
 // and interpolate a value between them assuming a linear function y=ax+b.
 //
 // If x is outside the bounds of the keys, returns `null`.
 function _interpolate(data, x, value_getter) {
     var keys = new Int32Array(data).sort(); 
     console.log(".interpolating x=" + x + " within " + keys);

     var key_index = find_key_index(keys, x);
     if (key_index < 0 || key_index >= keys.length) {
         console.log("..key search out of bounds (result " + key_index + ")");
         return null;
     }
     var x1 = keys[key_index];
     var y1 = value_getter(x1);
     console.log("..found x1=" + x1 + " y1=" + y1);
          
     if (key_index == keys.length - 1) {
         if (x1 != keys[keys.length - 1]) {
             console.log("..SHOULD NEVER HAPPEN: hit edge of graph not with key exactly at edge");
             return null;
         }
         
         console.log("..edge of graph, only y1 needed => " + y1);
         return y1;
     }
     
     if (x1 == x) {
         console.log("..exactly sought x, only y1 needed => " + y1);
         return y1;
     }
     
     var x2 = keys[key_index+1];
     var y2 = value_getter(x2);
     console.log("..found x2=" + x2 + " y2=" + y2);
     
     if (x > x2 || x < x1) {
        console.log("..SHOULD NEVER HAPPEN: linear interpolation out of bounds");
        return null;
     }
     
     if (y1 == null || y2 == null) {
         console.log(".. result => null");
         return null;
     }
     
     var result = y1 + (y2 - y1)*(x-x1)/(x2-x1);
     console.log("..result => " + result);
     return result;
 }
 

// Find index of last element <= key.
// TODO: binary search
function find_key_index(keys, key) {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == key) {
            return i;
        } else if (keys[i] > key) {
            return i - 1;
        }
    }
    
    return keys.length; // Out of bounds
}
 
export { interpolate3d, interpolate2d, interpolate };
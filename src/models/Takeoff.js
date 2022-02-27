import { interpolate2d, interpolate } from './Interpolator.js';
 
var _pa_oat = {
     0: { "-20": 750, 40: 1050 },
     2000: { "-20": 900, 40: 1400 },
     4000: { "-20": 1000, 40: 1700 },
     6000: { "-20": 1300, 40: 2200 },
     8000: { "-20": 1800, 40: 2800 },
}
 
var _weight = {
     750: { 2740: 750, 2300: 400 },
     1100: { 2740: 1100, 2300: 700 },
     1300: { 2740: 1300, 2300: 900 },
     1600: { 2740: 1600, 2300: 1100 },
     2200: { 2740: 2200, 2300: 1400 },
     2800: { 2740: 2800, 2300: 1800 },
}

var _wind = {
    500: { "-10": 600, 0: 500, 20: 300 },
    800: { "-10": 1000, 0: 800, 20: 550 },
    1050: { "-10": 1400, 0: 1050, 20: 850 },
    1450: { "-10": 1900, 0: 1450, 20: 1100 },
    1800: { "-10": 2400, 0: 1800, 20: 1500 },
    2400: { "-10": 3000, 0: 2400, 20: 1900 },
    2800: { "-10": 3600, 0: 2800, 20: 2300 },
}

var _obstacle = {
    300: { 0: 300, 1: 800 },
    800: { 0: 800, 1: 1300 },
    1250: { 0: 1250, 1: 2400 },
    1800: { 0: 1800, 1: 3800 },
    2300: { 0: 2300, 1: 5000 },
    3000: { 0: 3000, 1: 6000 },
    3600: { 0: 3600, 1: 6800 },
}

var _takeoffSpeed = {
    2740: 71,
    2500: 68,
    2300: 65,
}

var _fiftyFootSpeed = {
    2740: 63,
    2500: 60,
    2300: 58,
}
 
function getTakeoffPerformance(pa, oat, weight, wind, obstacle) {
    var stage1 = interpolate2d(_pa_oat, pa, oat);
    var stage2 = interpolate2d(_weight, stage1, weight);
    var stage3 = interpolate2d(_wind, stage2, wind);
    var stage4 = interpolate2d(_obstacle, stage3, obstacle);
    return stage4;
}

function getTakeoffSpeed(weight) {
    return interpolate(_takeoffSpeed, weight);
}

function getTakeoffFiftyFootSpeed(weight) {
    return interpolate(_fiftyFootSpeed, weight);
}

export { getTakeoffPerformance, getTakeoffSpeed, getTakeoffFiftyFootSpeed };
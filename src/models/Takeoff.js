import { interpolate2d, interpolate } from './Interpolator.js';
 
class NormalTakeoff {
    static _pa_oat = {
         0: { "-20": 700, 40: 1100 },
         2000: { "-20": 900, 40: 1400 },
         4000: { "-20": 1000, 40: 1700 },
         6000: { "-20": 1350, 40: 2200 },
         8000: { "-20": 1800, 40: 2800 },
    }
     
    static _weight = {
         750: { 2740: 750, 2300: 450 },
         1100: { 2740: 1100, 2300: 700 },
         1300: { 2740: 1300, 2300: 1100 },
         2200: { 2740: 2200, 2300: 1400 },
         2800: { 2740: 2800, 2300: 1800 },
    }

    static _wind = {
        500: { "-10": 600, 0: 500, 20: 300 },
        800: { "-10": 1000, 0: 800, 20: 550 },
        1050: { "-10": 1400, 0: 1050, 20: 850 },
        1450: { "-10": 1900, 0: 1450, 20: 1100 },
        1800: { "-10": 2400, 0: 1800, 20: 1400 },
        2400: { "-10": 3000, 0: 2400, 20: 1900 },
        2800: { "-10": 3600, 0: 2800, 20: 2300 },
    }

    static _obstacle = {
        300: { 0: 300, 1: 800 },
        800: { 0: 800, 1: 1350 },
        1250: { 0: 1250, 1: 2400 },
        1800: { 0: 1800, 1: 3800 },
        2400: { 0: 2400, 1: 5000 },
        3000: { 0: 3000, 1: 6000 },
        3600: { 0: 3600, 1: 6800 },
    }

    static _takeoffSpeed = {
        2740: 63,
        2500: 60,
        2300: 58,
    }

    static _fiftyFootSpeed = {
        2740: 71,
        2500: 68,
        2300: 65,
    }
    
    static getDistance(pa, oat, weight, wind, obstacle) {
        var stage1 = interpolate2d(this._pa_oat, pa, oat);
        var stage2 = interpolate2d(this._weight, stage1, weight);
        var stage3 = interpolate2d(this._wind, stage2, wind);
        var stage4 = interpolate2d(this._obstacle, stage3, obstacle);
        return stage4;
    }

    static getLiftoffSpeed(weight) {
        return interpolate(this._takeoffSpeed, weight);
    }

    static getFiftyFootSpeed(weight) {
        return interpolate(this._fiftyFootSpeed, weight);
    }
}

 
class PerformanceTakeoff {
    static _pa_oat = {
         0: { "-20": 750, 40: 1100 },
         2000: { "-20": 800, 40: 1250 },
         4000: { "-20": 1000, 40: 1600 },
         6000: { "-20": 1400, 40: 2200 },
         8000: { "-20": 1700, 40: 2700 },
    }
     
    static _weight = {
         700: { 2740: 700, 2300: 400 },
         1100: { 2740: 1100, 2300: 700 },
         1300: { 2740: 1300, 2300: 900 },
         1600: { 2740: 1600, 2300: 1000 },
         2200: { 2740: 2200, 2300: 1400 },
         2700: { 2740: 2700, 2300: 1750 },
    }

    static _wind = {
        400: { "-10": 600, 0: 400, 20: 300 },
        700: { "-10": 900, 0: 700, 20: 550 },
        1050: { "-10": 1400, 0: 1050, 20: 800 },
        1400: { "-10": 1800, 0: 1400, 20: 1100 },
        1700: { "-10": 2300, 0: 1700, 20: 1400 },
        2200: { "-10": 2900, 0: 2200, 20: 1750 },
        2700: { "-10": 3500, 0: 2700, 20: 2200 },
    }

    static _obstacle = {
        300: { 0: 300, 1: 650 },
        800: { 0: 800, 1: 1500 },
        1400: { 0: 1400, 1: 2250 },
        2000: { 0: 2000, 1: 3000 },
        2700: { 0: 2700, 1: 4000 },
        3500: { 0: 3500, 1: 5000 },
    }

    static _takeoffSpeed = {
        2740: 62,
        2500: 60,
        2300: 57,
    }

    static _fiftyFootSpeed = {
        2740: 66,
        2500: 63,
        2300: 60,
    }
    
    static getDistance(pa, oat, weight, wind, obstacle) {
        var stage1 = interpolate2d(this._pa_oat, pa, oat);
        var stage2 = interpolate2d(this._weight, stage1, weight);
        var stage3 = interpolate2d(this._wind, stage2, wind);
        var stage4 = interpolate2d(this._obstacle, stage3, obstacle);
        return stage4;
    }

    static getLiftoffSpeed(weight) {
        return interpolate(this._takeoffSpeed, weight);
    }

    static getFiftyFootSpeed(weight) {
        return interpolate(this._fiftyFootSpeed, weight);
    }
}


export { NormalTakeoff, PerformanceTakeoff };
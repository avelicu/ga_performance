import { interpolate2d, interpolate } from './Interpolator.js';
 
class NormalLanding {
    static _pa_oat = {
         0: { "-20": 1800, 40: 2100 },
         2000: { "-20": 1950, 40: 2300 },
         4000: { "-20": 2100, 40: 2500 },
         6000: { "-20": 2300, 40: 2750 },
         8000: { "-20": 2650, 40: 3200 },
    }
     
    static _weight = {
         1800: { 2740: 1800, 2300: 1600 },
         1950: { 2740: 1950, 2300: 1750 },
         2100: { 2740: 2100, 2300: 1850 },
         2300: { 2740: 2300, 2300: 2000 },
         2500: { 2740: 2500, 2300: 2200 },
         2750: { 2740: 2750, 2300: 2400 },
         3000: { 2740: 3000, 2300: 2550 },
         3200: { 2740: 3200, 2300: 2750 },
    }

    static _wind = {
        1600: { "-10": 2000, 0: 1600, 20: 1300 },
        1750: { "-10": 2150, 0: 1750, 20: 1400 },
        1850: { "-10": 2350, 0: 1850, 20: 1500 },
        2000: { "-10": 2550, 0: 2000, 20: 1650 },
        2150: { "-10": 2750, 0: 2150, 20: 1800 },
        2350: { "-10": 3000, 0: 2350, 20: 1950 },
        2550: { "-10": 3100, 0: 2550, 20: 2150 },
        2750: { "-10": 4200, 0: 2750, 20: 2300 },
    }

    static _obstacle = {
        1250: { 1: 1250, 0: 500 },
        1500: { 1: 1500, 0: 650 },
        1800: { 1: 1800, 0: 800 },
        2150: { 1: 2150, 0: 1050 },
        2550: { 1: 2550, 0: 1300 },
        3000: { 1: 3000, 0: 1600 },
        3450: { 1: 3450, 0: 1900 },
    }

    static _approachSpeed = {
        2740: 71,
        2500: 69,
        2300: 65,
    }
    
    static getDistance(pa, oat, weight, wind, obstacle) {
        var stage1 = interpolate2d(this._pa_oat, pa, oat);
        var stage2 = interpolate2d(this._weight, stage1, weight);
        var stage3 = interpolate2d(this._wind, stage2, wind);
        var stage4 = interpolate2d(this._obstacle, stage3, obstacle);
        return stage4;
    }

    static getApproachSpeed(weight) {
        return interpolate(this._approachSpeed, weight);
    }
}

 
class PerformanceLanding {
    static _pa_oat = {
         0: { "-20": 1500, 40: 1700 },
         2000: { "-20": 1650, 40: 1900 },
         4000: { "-20": 1800, 40: 2100 },
         6000: { "-20": 2000, 40: 2350 },
         8000: { "-20": 2250, 40: 2600 },
    }
     
    static _weight = {
         1450: { 2740: 1450, 2300: 1350 },
         1700: { 2740: 1700, 2300: 1500 },
         1900: { 2740: 1900, 2300: 1700 },
         2100: { 2740: 2100, 2300: 1850 },
         2350: { 2740: 2350, 2300: 2050 },
         2600: { 2740: 2600, 2300: 2300 },
    }

    static _wind = {
        1300: { "-10": 1700, 0: 1300, 20: 1050 },
        1500: { "-10": 1900, 0: 1500, 20: 1200 },
        1700: { "-10": 2100, 0: 1700, 20: 1350 },
        1850: { "-10": 2300, 0: 1850, 20: 1550 },
        2300: { "-10": 2850, 0: 2300, 20: 1950 },
    }

    static _obstacle = {
        1050: { 1: 1050, 0: 400 },
        1200: { 1: 1200, 0: 550 },
        1550: { 1: 1550, 0: 700 },
        1950: { 1: 1950, 0: 900 },
        2350: { 1: 2350, 0: 1050 },
        2850: { 1: 2850, 0: 1300 },
    }

    static _approachSpeed = {
        2740: 65,
        2500: 62,
        2300: 59,
    }
    
    static getDistance(pa, oat, weight, wind, obstacle) {
        var stage1 = interpolate2d(this._pa_oat, pa, oat);
        var stage2 = interpolate2d(this._weight, stage1, weight);
        var stage3 = interpolate2d(this._wind, stage2, wind);
        var stage4 = interpolate2d(this._obstacle, stage3, obstacle);
        return stage4;
    }

    static getApproachSpeed(weight) {
        return interpolate(this._approachSpeed, weight);
    }
}

export { NormalLanding, PerformanceLanding };
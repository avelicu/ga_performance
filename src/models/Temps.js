import { interpolate } from './Interpolator.js';

class Temps {
    static _stdtemp = {
            0:  15,
         2000:  11,
         4000:   7,
         6000:   3,
         8000:  -1,
        10000:  -5,
        12000:  -9,
        14000: -13,
    }
    
    static getStandardTemperature(altitude) {
        return interpolate(this._stdtemp, altitude);
    }
}

export { Temps };
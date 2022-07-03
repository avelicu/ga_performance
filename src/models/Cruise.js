import { interpolate, interpolate2d, interpolate3d } from './Interpolator.js';
 
class Cruise {
    // Manifold pressure value `mp` is coerced into integer as round(mp*10).
    // Final results are BHP values.
    static _pa_rpm_mp = {
        0: {
            2700: { 235: 150, 220: 140, 210: 130, 195: 120, 180: 110, 154: 90 },
            2600: { 245: 150, 230: 140, 217: 130, 205: 120, 190: 110, 163: 90 },
            2400: { 270: 150, 255: 140, 240: 130, 225: 120, 210: 110, 175: 90 },
            2200: {                               242: 120, 225: 110, 190: 90 },
            2000: {                                                   210: 90 },
        },
        2000: {
            2700: { 232: 150, 220: 140, 206: 130, 193: 120, 180: 110, 153: 90 },
            2600: { 244: 150, 230: 140, 216: 130, 202: 120, 188: 110, 160: 90 },
            2400: { 268: 150, 251: 140, 236: 130, 220: 120, 204: 110, 172: 90 },
            2200: {                               240: 120, 222: 110, 187: 90 },
            2000: {                                                   205: 90 },
        },
        4000: {
            2700: { 232: 150, 218: 140, 205: 130, 192: 120, 179: 110, 153: 90 },            
            2600: { 244: 150, 229: 140, 215: 130, 201: 120, 187: 110, 158: 90 },
            2400: {           249: 140, 233: 130, 217: 120, 202: 110, 171: 90 },
            2200: {                               237: 120, 220: 110, 187: 90 },
            2000: {                                                   204: 90 },
        },
        6000: {
            2700: { 231: 150, 217: 140, 204: 130, 191: 120, 178: 110, 152: 90 },
            2600: { 241: 150, 227: 140, 213: 130, 199: 120, 186: 110, 157: 90 },
            2400: {           244: 140, 228: 130, 213: 120, 198: 110, 168: 90 },
            2200: {                               236: 120, 220: 110, 183: 90 },
            2000: {                                                   204: 90 },
        },
        8000: {
            2700: { 236: 150, 217: 140, 204: 130, 190: 120, 178: 110, 151: 90 },
            2600: {           227: 140, 212: 130, 198: 120, 186: 110, 157: 90 },
            2400: {                               213: 120, 198: 110, 165: 90 },
            2200: {                                         220: 110, 182: 90 },
            2000: {                                                   203: 90 },
        },
        10000: {
            2700: {           214: 140, 202: 130, 188: 120, 176: 110, 150: 90 },
            2600: {                               198: 120, 183: 110, 156: 90 },
            2400: {                               210: 120, 195: 110, 165: 90 },
            2200: {                                                   182: 90 },
        },
        12000: {
            2700: {                               188: 120, 175: 110, 149: 90 },
            2600: {                               196: 120, 182: 110, 155: 90 },
            2400: {                                         193: 110, 164: 90 },
            2200: {                                                   180: 90 },
        },
        14000: {
            2700: {                                         173: 110, 147: 90 },
            2600: {                                         179: 110, 154: 90 },
            2400: {                                                   162: 90 },
        },
    }
    
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
    
    static _pa_oat = {
            0: {  "15": 0, 60: 90 },
         2000: {  "-5": 0, 60: 145 },
         4000: { "-25": 0, 60: 190 },
         6000: { "-40": 0, 60: 240 },
         8000: { "-60": 0, 60: 280 },
         10000: { "-60": 50, 30: 270 },
         12000: { "-60": 100, 10: 280 },
         14000: { "-60": 150, "-10": 280 },
         16000: { "-60": 200, "-30": 280 },
    }
    
    // The full throttle cutoff is probably not correct here..
    static _weight_pp = {
        2300: {
            45: { 0: 126, 280: 142 },
            55: { 0: 139, 270: 158 },
            65: { 0: 149, 230: 166, 280: 162 },
            75: { 0: 158, 160: 171, 280: 164 },
        },
        2740: {
            45: { 0: 120, 280: 135 }, // line is curved but it's the only one - graph error?
            55: { 0: 135, 280: 152 },
            65: { 0: 146, 230: 161, 280: 158 },
            75: { 0: 155, 165: 168, 280: 158 },
        },
    }
    
    static getBhp(pa, rpm, mp, oat) {
        var stdtemp = interpolate(this._stdtemp, pa);
        var mpcorrection = (oat-stdtemp)*4/10; // 0.4" per 10 degrees difference
        // console.log("mp correction: " + mpcorrection);
        
        // subtract the mp correction to look in the tables for the uncorrected mp
        return interpolate3d(
            this._pa_rpm_mp,
            pa, rpm, mp - mpcorrection);
    }
    
    static getPercentPower(pa, rpm, mp, oat) {
        var bhp = this.getBhp(pa, rpm, mp, oat);
        if (bhp == null) {
            return null;
        }
        
        return (bhp / 200.0)*100;
    }
    
    static getTrueAirspeed(pa, rpm, mp, oat, weight) {
        var pp = this.getPercentPower(pa, rpm, mp, oat);
        var stage1 = interpolate2d(this._pa_oat, pa, oat);
        var stage2 = interpolate3d(this._weight_pp, weight, pp, stage1);
        return stage2;
    }
}

export { Cruise };
import React from 'react';
import logo from './logo.svg';
import './App.css';

import { NormalTakeoff, PerformanceTakeoff } from './models/Takeoff.js';
import { NormalLanding, PerformanceLanding } from './models/Landing.js';
import { Climb } from './models/Climb.js';
import { Cruise } from './models/Cruise.js';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            emptyWeight: 1860,
            maxGrossWeight: 2740,
            weight: 2500,
            
            pressureAltitude: 0,
            temperature: 0,
            wind: 0,
            
            rpm: 2600,
            mp: 21.7,
        }
        this.setWeight = this.setWeight.bind(this);
        this.setPressureAltitude = this.setPressureAltitude.bind(this);
        this.setTemperature = this.setTemperature.bind(this);
        this.setWind = this.setWind.bind(this);
        this.setRpm = this.setRpm.bind(this);
        this.setMp = this.setMp.bind(this);
    }
    
    setWeight(event) {
        this.setState({weight: event.target.value});
    }

    setPressureAltitude(event) {
        this.setState({pressureAltitude: event.target.value});
    }

    setTemperature(event) {
        this.setState({temperature: event.target.value});
    }
    
    setWind(event) {
        this.setState({wind: event.target.value});
    }
    
    setRpm(event) {
        this.setState({rpm: event.target.value});
    }
    
    setMp(event) {
        this.setState({mp: event.target.value});
    }
    
    getAboveEmptyWeight() {
        return this.state.weight - this.state.emptyWeight; 
    }

    getBelowMaxGrossWeight() {
        return this.state.maxGrossWeight - this.state.weight; 
    }
    
    prettify(num) {
        if (num == null) {
            return "⚠";
        }
        
        return Math.trunc(num);
    }
    
    getTakeoffGroundRoll() {
        return this.prettify(
            NormalTakeoff.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }

    getTakeoff50ft() {
        return this.prettify(
            NormalTakeoff.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 1));
    }
    
    getTakeoffSpeed() {
        return this.prettify(
            NormalTakeoff.getLiftoffSpeed(
                this.state.weight));
    }  
    
    getTakeoffFiftyFootSpeed() {
        return this.prettify(
            NormalTakeoff.getFiftyFootSpeed(
                this.state.weight));
    }

    
    getShortTakeoffGroundRoll() {
        return this.prettify(
            PerformanceTakeoff.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }

    getShortTakeoff50ft() {
        return this.prettify(
            PerformanceTakeoff.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 1));
    }
    
    getShortTakeoffSpeed() {
        return this.prettify(
            PerformanceTakeoff.getLiftoffSpeed(
                this.state.weight));
    }  
    
    getShortTakeoffFiftyFootSpeed() {
        return this.prettify(
            PerformanceTakeoff.getFiftyFootSpeed(
                this.state.weight));
    }
    
    getLandingGroundRoll() {
        return this.prettify(
            NormalLanding.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }
    
    getLanding50ft() {
        return this.prettify(
            NormalLanding.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 1));
    }
    
    getLandingSpeed() {
        return this.prettify(
           NormalLanding.getApproachSpeed(
               this.state.weight));
    }
    
    getShortLandingGroundRoll() {
        return this.prettify(
            PerformanceLanding.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }
    
    getShortLanding50ft() {
        return this.prettify(
            PerformanceLanding.getDistance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 1));
    }
    
    getShortLandingSpeed() {
        return this.prettify(
           PerformanceLanding.getApproachSpeed(
               this.state.weight));
    }
    
    getVy() {
        return this.prettify(
            Climb.getVy(
                this.state.weight, this.state.pressureAltitude));
    }
    
    getRateOfClimb() {
        return this.prettify(
            Climb.getRate(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight));
    }
    
    getPercentPower() {
        return this.prettify(
            Cruise.getPercentPower(
                this.state.pressureAltitude,
                this.state.rpm,
                Math.trunc(this.state.mp*10),
                this.state.temperature));
    }
    
    getTrueAirspeed() {
        return this.prettify(
            Cruise.getTrueAirspeed(
                this.state.pressureAltitude,
                this.state.rpm,
                Math.trunc(this.state.mp*10),
                this.state.temperature,
                this.state.weight));
    }
    
    render() {
        return (
            <div className="App">
              <header className="header">
                <p>M20J Performance Calculator</p>
                <img className="App-logo" src="logo192.png" />
              </header>
              
              <section className="input">
                <p>Weight (lbs): 0+{this.getAboveEmptyWeight()}</p>
                <p><input type="range" min={this.state.emptyWeight} max="2740" step="10" value={this.state.weight} onChange={this.setWeight} /></p>
                <p><input type="text" inputMode="numeric" value={this.state.weight} onChange={this.setWeight} /></p>
                <p>Pressure Altitude (feet):</p>
                <p><input type="range" min="0" max="16000" step="500" value={this.state.pressureAltitude} onChange={this.setPressureAltitude} /></p>                
                <p><input type="text" inputMode="numeric" value={this.state.pressureAltitude} onChange={this.setPressureAltitude} /></p>
                <p>Temperature (&deg;C):</p>
                <p><input type="range" min="-40" max="60" step="1" value={this.state.temperature} onChange={this.setTemperature} /></p>
                <p><input type="text" inputMode="numeric" value={this.state.temperature} onChange={this.setTemperature} /></p>
                <p>Headwind (kts):</p>
                <p><input type="range" min="-10" max="20" step="1" value={this.state.wind} onChange={this.setWind} /></p>
                <p><input type="text" inputMode="numeric" value={this.state.wind} onChange={this.setWind} /></p>
                <p>RPM:</p>
                <p><input type="range" min="2000" max="2700" step="100" value={this.state.rpm} onChange={this.setRpm} /></p>
                <p><input type="text" inputMode="numeric" value={this.state.rpm} onChange={this.setRpm} /></p>
                <p>MP:</p>
                <p><input type="range" min="14.7" max="27.0" step=".1" value={this.state.mp} onChange={this.setMp} /></p>
                <p><input type="text" inputMode="numeric" value={this.state.mp} onChange={this.setMp} /></p>
              </section>

              <section className="subheader">
                <p>Normal Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed (kts)</p><p>{this.getTakeoffSpeed()}</p>
                <p>Ground roll (ft)</p><p>{this.getTakeoffGroundRoll()}</p>
                <p>50 foot speed (kts)</p><p>{this.getTakeoffFiftyFootSpeed()}</p>
                <p>50 ft obstacle (ft)</p><p>{this.getTakeoff50ft()}</p>
              </section>

              <section className="subheader">
                <p>High Performance Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed (kts)</p><p>{this.getShortTakeoffSpeed()}</p>
                <p>Ground roll (ft)</p><p>{this.getShortTakeoffGroundRoll()}</p>
                <p>50 foot speed (kts)</p><p>{this.getShortTakeoffFiftyFootSpeed()}</p>
                <p>50 ft obstacle (ft)</p><p>{this.getShortTakeoff50ft()}</p>
              </section>

              <section className="subheader">
                <p>Climb</p>
              </section>
                            
              <section className="climb_output">
                <p>Vy (kts)</p><p>{this.getVy()}</p>
                <p>Rate of climb (fpm)</p><p>{this.getRateOfClimb()}</p>
                <p class="explanation">Warning: climb performance is currently overestimated due to model limitations</p>                
              </section>

              <section className="subheader">
                <p>Cruise</p>
              </section>

              <section className="cruise_output">
                <p>Power</p><p>{this.getPercentPower()}%</p>
                <p>True Airspeed (kts)</p><p>{this.getTrueAirspeed()}</p>
              </section>

              <section className="subheader">
                <p>Normal Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed (kts)</p><p>{this.getLandingSpeed()}</p>
                <p></p><p></p>
                <p>Ground roll (ft)</p><p>{this.getLandingGroundRoll()}</p>
                <p>50 ft obstacle (ft)</p><p>{this.getLanding50ft()}</p>
              </section>             
              
              <section className="subheader">
                <p>Performance Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed (kts)</p><p>{this.getShortLandingSpeed()}</p>
                <p></p><p></p>
                <p>Ground roll (ft)</p><p>{this.getShortLandingGroundRoll()}</p>
                <p>50 ft obstacle (ft)</p><p>{this.getShortLanding50ft()}</p>
              </section>
            </div>
        );
    }
}

export default App;

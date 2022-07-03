import React from 'react';
import logo from './logo.svg';
import './App.css';

import { NormalTakeoff, PerformanceTakeoff } from './models/Takeoff.js';
import { NormalLanding, PerformanceLanding } from './models/Landing.js';
import { Climb } from './models/Climb.js';
import { Cruise } from './models/Cruise.js';

const NavSection = ({ visible, children }) => {
    if (visible) {
        return children;
    } else {
        return null;
    }
}

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            emptyWeight: 1860,
            maxGrossWeight: 2740,
            weight: 2500,
            
            indicatedAltitude: 0,
            altimeterSetting: 29.92,
            
            temperature: 0,
            wind: 0,
            
            rpm: 2600,
            mp: 21.7,
            
            tab: '',
        }
        this.setWeight = this.setWeight.bind(this);
        this.setIndicatedAltitude = this.setIndicatedAltitude.bind(this);
        this.setAltimeterSetting = this.setAltimeterSetting.bind(this);
        this.setTemperature = this.setTemperature.bind(this);
        this.setWind = this.setWind.bind(this);
        this.setRpm = this.setRpm.bind(this);
        this.setMp = this.setMp.bind(this);
    }
    
    setWeight(event) {
        this.setState({weight: event.target.value});
    }

    setIndicatedAltitude(event) {
        this.setState({indicatedAltitude: event.target.value});
    }

    setAltimeterSetting(event) {
        this.setState({altimeterSetting: event.target.value});
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
    
    setTab(tab) {
        this.setState({tab: tab});
    }
    
    getPressureAltitude() {
        // JS is weird, we need the first + to cast to an int, otherwise second + will concatenate strings..
        return Math.round(+this.state.indicatedAltitude + (29.92 - this.state.altimeterSetting) * 1000);
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
                this.getPressureAltitude(),
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }

    getTakeoff50ft() {
        return this.prettify(
            NormalTakeoff.getDistance(
                this.getPressureAltitude(),
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
                this.getPressureAltitude(),
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }

    getShortTakeoff50ft() {
        return this.prettify(
            PerformanceTakeoff.getDistance(
                this.getPressureAltitude(),
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
                this.getPressureAltitude(),
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }
    
    getLanding50ft() {
        return this.prettify(
            NormalLanding.getDistance(
                this.getPressureAltitude(),
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
                this.getPressureAltitude(),
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }
    
    getShortLanding50ft() {
        return this.prettify(
            PerformanceLanding.getDistance(
                this.getPressureAltitude(),
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
                this.state.weight, this.getPressureAltitude()));
    }
    
    getRateOfClimb() {
        return this.prettify(
            Climb.getRate(
                this.getPressureAltitude(),
                this.state.temperature,
                this.state.weight));
    }
    
    getPercentPower() {
        return this.prettify(
            Cruise.getPercentPower(
                this.getPressureAltitude(),
                this.state.rpm,
                Math.trunc(this.state.mp*10),
                this.state.temperature));
    }
    
    getTrueAirspeed() {
        return this.prettify(
            Cruise.getTrueAirspeed(
                this.getPressureAltitude(),
                this.state.rpm,
                Math.trunc(this.state.mp*10),
                this.state.temperature,
                this.state.weight));
    }

    render() {
        const _NavButton = ({ tab, children }) => {
            if (tab == this.state.tab) {
                return <p className="active">{children}</p>
            } else {
                return <p onClick={() => this.setTab(tab)}>{children}</p>
            }
        }
        
        const NavButton = _NavButton.bind(this);
        
        const tabsMatch = (tabs) => {
            return this.state.tab === '' || tabs.includes(this.state.tab);
        }
        
        return (
            <div className="App">
                <div className="fixed-nav-bar">
                    <NavButton tab="">All</NavButton>
                    <NavButton tab="departure">Takeoff &amp; Climb</NavButton>
                    <NavButton tab="cruise">Cruise</NavButton>
                    <NavButton tab="approach">Approach &amp; Landing</NavButton>
                </div>

              <header className="header">
                <p>M20J Performance Calculator</p>
                <img className="App-logo" src="logo192.png" />
              </header>
              
              <section className="input">
                <NavSection visible={tabsMatch(["departure", "cruise", "approach"])}>
                    <p>Weight (lbs): 0+{this.getAboveEmptyWeight()}</p>
                    <p><input type="range" min={this.state.emptyWeight} max="2740" step="10" value={this.state.weight} onChange={this.setWeight} /></p>
                    <p><input type="text" inputMode="numeric" value={this.state.weight} onChange={this.setWeight} /></p>
                    
                    <p>Indicated Altitude (feet): (PA: {this.getPressureAltitude()})</p>
                    <p><input type="range" min="0" max="16000" step="500" value={this.state.indicatedAltitude} onChange={this.setIndicatedAltitude} /></p>                
                    <p><input type="text" inputMode="numeric" value={this.state.indicatedAltitude} onChange={this.setIndicatedAltitude} /></p>

                    <p>Altimeter Setting (inHg):</p>
                    <p><input type="range" min="28.1" max="31" step=".01" value={this.state.altimeterSetting} onChange={this.setAltimeterSetting} /></p>                
                    <p><input type="text" inputMode="numeric" value={this.state.altimeterSetting} onChange={this.setAltimeterSetting} /></p>
                    

                    <p>Temperature (&deg;C):</p>
                    <p><input type="range" min="-40" max="60" step="1" value={this.state.temperature} onChange={this.setTemperature} /></p>
                    <p><input type="text" inputMode="numeric" value={this.state.temperature} onChange={this.setTemperature} /></p>
                </NavSection>

                <NavSection visible={tabsMatch(["departure", "approach"])}>
                    <p>Headwind (kts):</p>
                    <p><input type="range" min="-10" max="20" step="1" value={this.state.wind} onChange={this.setWind} /></p>
                    <p><input type="text" inputMode="numeric" value={this.state.wind} onChange={this.setWind} /></p>
                </NavSection>
                
                <NavSection visible={tabsMatch(["cruise"])}>
                    <p>RPM:</p>
                    <p><input type="range" min="2000" max="2700" step="100" value={this.state.rpm} onChange={this.setRpm} /></p>
                    <p><input type="text" inputMode="numeric" value={this.state.rpm} onChange={this.setRpm} /></p>
                    <p>MP:</p>
                    <p><input type="range" min="14.7" max="27.0" step=".1" value={this.state.mp} onChange={this.setMp} /></p>
                    <p><input type="text" inputMode="numeric" value={this.state.mp} onChange={this.setMp} /></p>
                </NavSection>
              </section>

              <NavSection visible={tabsMatch(["departure"])}>
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
                    <p className="explanation">Warning: climb performance is currently overestimated due to model limitations</p>                
                  </section>
              </NavSection>
              
              <NavSection visible={tabsMatch(["cruise"])}>
                  <section className="subheader">
                    <p>Cruise</p>
                  </section>

                  <section className="cruise_output">
                    <p>Power</p><p>{this.getPercentPower()}%</p>
                    <p>True Airspeed (kts)</p><p>{this.getTrueAirspeed()}</p>
                  </section>
              </NavSection>

              <NavSection visible={tabsMatch(["approach"])}>
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
              </NavSection>
            </div>
        );
    }
}

export default App;

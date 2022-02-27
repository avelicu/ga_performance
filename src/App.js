import React from 'react';
import logo from './logo.svg';
import './App.css';

import { getTakeoffPerformance, getTakeoffSpeed, getTakeoffFiftyFootSpeed } from './models/Takeoff.js';

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
        }
        this.setWeight = this.setWeight.bind(this);
        this.setPressureAltitude = this.setPressureAltitude.bind(this);
        this.setTemperature = this.setTemperature.bind(this);
        this.setWind = this.setWind.bind(this);
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
    
    getAboveEmptyWeight() {
        return this.state.weight - this.state.emptyWeight; 
    }

    getBelowMaxGrossWeight() {
        return this.state.maxGrossWeight - this.state.weight; 
    }
    
    prettify(num) {
        if (num == null) {
            return "<invalid>";
        }
        
        return Math.trunc(num);
    }
    
    getTakeoffGroundRoll() {
        return this.prettify(
            getTakeoffPerformance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 0));
    }

    getTakeoff50ft() {
        return this.prettify(
            getTakeoffPerformance(
                this.state.pressureAltitude,
                this.state.temperature,
                this.state.weight,
                this.state.wind,
                /* obstacle= */ 1));
    }
    
    getTakeoffSpeed() {
        return this.prettify(
            getTakeoffSpeed(
                this.state.weight));
    }  
    
    getTakeoffFiftyFootSpeed() {
        return this.prettify(
            getTakeoffFiftyFootSpeed(
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
                <p>Weight (lbs):</p>
                <p><input type="text" inputMode="numeric" value={this.state.weight} onChange={this.setWeight} /></p>
              </section>
              <section className="explanation">
                <p>
                    {this.getAboveEmptyWeight()} lbs above empty, {this.getBelowMaxGrossWeight()} lbs below max gross
                </p>
              </section>
              <section className="input">
                <p>Pressure Altitude (feet):</p>
                <p><input type="text" inputMode="numeric" value={this.state.pressureAltitude} onChange={this.setPressureAltitude} /></p>
              </section>
              <section className="input">
                <p>Temperature (&deg;C):</p>
                <p><input type="text" inputMode="numeric" value={this.state.temperature} onChange={this.setTemperature} /></p>
              </section>
              <section className="input">
                <p>Wind (kts):</p>
                <p><input type="text" inputMode="numeric" value={this.state.wind} onChange={this.setWind} /></p>
              </section>
              
              <section className="subheader">
                <p>Takeoff</p>
              </section>
              
              <section className="output">
                <p>Ground roll (ft)</p><p>{this.getTakeoffGroundRoll()}</p>
                <p>50 ft obstacle (ft)</p><p>{this.getTakeoff50ft()}</p>
              </section>

              <section className="output">
                <p>Takeoff speed (kts)</p><p>{this.getTakeoffSpeed()}</p>
                <p>50 foot speed (kts)</p><p>{this.getTakeoffFiftyFootSpeed()}</p>
              </section>
            </div>
        );
    }
}

export default App;

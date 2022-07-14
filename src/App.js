import React, { useState, useEffect } from 'react';
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

const InputWithSlider = ({ label, getter, setter, min, max, step, className }) => {
    return [
        <p className={className}>{label}</p>,
        <p className={className}><input type="range" min={min} max={max} step={step} value={getter} onChange={e => setter(Number(e.target.value))} /></p>,
        <p className={className}><input type="text" inputMode="numeric" value={getter} onChange={e => setter(Number(e.target.value))} /></p>,
    ]
}

const Prettified = ({ value, decimals=0 }) => {
    if (value == null) {
        return <p className="invalid">⚠</p>
    } else {
        return <p>{Number(value).toFixed(decimals)}</p>
    }
}

const App = () => {

    const [emptyWeight, setEmptyWeight] = useState(1860);
    const [maxGrossWeight, setMaxGrossWeight] = useState(1860);
    
    const [weight, setWeight] = useState(2500);
    
    const [subweights, setSubweights] = useState(false);
    const [subWeightPilot, setSubweightPilot] = useState(190);
    const [subWeightCopilot, setSubweightCopilot] = useState(0);
    const [subWeightPassenger1, setSubweightPassenger1] = useState(0);
    const [subWeightPassenger2, setSubweightPassenger2] = useState(0);
    const [subWeightCargo, setSubweightCargo] = useState(30);
    const [subWeightFuel, setSubweightFuel] = useState(64);
    
    const [indicatedAltitude, setIndicatedAltitude] = useState(0);
    const [altimeterSetting, setAltimeterSetting] = useState(29.92);
    
    const [temperature, setTemperature] = useState(0);
    const [wind, setWind] = useState(0);
    
    const [rpm, setRpm] = useState(2600);
    const [mp, setMp] = useState(21.7);
    
    const [currentTab, setCurrentTab] = useState('');
    
    useEffect(() => {
        setWeight(
            emptyWeight
            + subWeightPilot
            + subWeightCopilot
            + subWeightPassenger1
            + subWeightPassenger2
            + subWeightCargo
            + 6 * subWeightFuel);
    }, [
        emptyWeight,
        subWeightPilot,
        subWeightCopilot,
        subWeightPassenger1,
        subWeightPassenger2,
        subWeightCargo,
        subWeightFuel]);

    const getPressureAltitude = () => {
        return Math.round(+indicatedAltitude + (29.92 - altimeterSetting) * 1000);
        // JS is weird, we need the first + to cast to an int, otherwise second + will concatenate strings..
    }
    
    const NavButton = ({ tab, children }) => {
        if (tab == currentTab) {
            return <p className="active">{children}</p>
        } else {
            return <p onClick={() => setCurrentTab(tab)}>{children}</p>
        }
    }

    const tabsMatch = (tabs) => {
        return currentTab === '' || tabs.includes(currentTab);
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
                <p onClick={() => setSubweights(!subweights)}>Weight (lbs): 0+{weight - emptyWeight} ℹ️</p>
                <p><input type="range" min={emptyWeight} max="2740" step="10" value={weight} onChange={e => setWeight(Number(e.target.value))} /></p>
                <p><input type="text" inputMode="numeric" value={weight} onChange={e => setWeight(Number(e.target.value))} /></p>
                
                <NavSection visible={subweights}>
                    <InputWithSlider className="subsection" label="Pilot" getter={subWeightPilot} setter={setSubweightPilot} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Copilot" getter={subWeightCopilot} setter={setSubweightCopilot} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Passenger 1" getter={subWeightPassenger1} setter={setSubweightPassenger1} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Passenger 2" getter={subWeightPassenger2} setter={setSubweightPassenger2} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Cargo" getter={subWeightCargo} setter={setSubweightCargo} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Fuel (gals)" getter={subWeightFuel} setter={setSubweightFuel} min="0" max="64" step="1" />
                </NavSection>
                
                <InputWithSlider
                    label={"Indicated Altitude(feet): (PA: " + getPressureAltitude() + ")"}
                    getter={indicatedAltitude}
                    setter={setIndicatedAltitude}
                    min="0" max="16000" step="500" />

                <InputWithSlider
                    label="Altimeter Setting (inHg):"
                    getter={altimeterSetting}
                    setter={setAltimeterSetting}
                    min="28.1" max="31" step=".01" />

                <InputWithSlider
                    label="Temperature (&deg;C)"
                    getter={temperature}
                    setter={setTemperature}
                    min="-40" max="60" step="1" />
            </NavSection>

            <NavSection visible={tabsMatch(["departure", "approach"])}>
                <InputWithSlider
                    label="Headwind (kts)"
                    getter={wind}
                    setter={setWind}
                    min="-10" max="20" step="1" />
            </NavSection>
            
            <NavSection visible={tabsMatch(["cruise"])}>
                <InputWithSlider
                    label="RPM"
                    getter={rpm}
                    setter={setRpm}
                    min="2000" max="2700" step="100" />
                
                <InputWithSlider
                    label="MP"
                    getter={mp}
                    setter={setMp}
                    min="14.7" max="27.0" step=".1" />
            </NavSection>
          </section>

          <NavSection visible={tabsMatch(["departure"])}>
              <section className="subheader">
                <p>Normal Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed (kts)</p>
                <Prettified value={NormalTakeoff.getLiftoffSpeed(weight)} />
                
                <p>Ground roll (ft)</p>
                <Prettified value={NormalTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} />
                
                <p>50 foot speed (kts)</p>
                <Prettified value={NormalTakeoff.getFiftyFootSpeed(weight)} />
                
                <p>50 ft obstacle (ft)</p>
                <Prettified value={NormalTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} />
              </section>

              <section className="subheader">
                <p>High Performance Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed (kts)</p>
                <Prettified value={PerformanceTakeoff.getLiftoffSpeed(weight)} />
                
                <p>Ground roll (ft)</p>
                <Prettified value={PerformanceTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} />
                
                <p>50 foot speed (kts)</p>
                <Prettified value={PerformanceTakeoff.getFiftyFootSpeed(weight)} />
                
                <p>50 ft obstacle (ft)</p>
                <Prettified value={PerformanceTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} />
              </section>
              
              <section className="subheader">
                <p>Climb</p>
              </section>
                            
              <section className="climb_output">
                <p>Vy (kts)</p>
                <Prettified value={Climb.getVy(weight, getPressureAltitude())} />
                <p>Rate of climb (fpm)</p>
                <Prettified value={Climb.getRate(getPressureAltitude(), temperature, weight)} />
                <p className="explanation">Warning: climb performance is currently overestimated due to model limitations</p>                
              </section>
          </NavSection>
          
          <NavSection visible={tabsMatch(["cruise"])}>
              <section className="subheader">
                <p>Cruise</p>
              </section>

              <section className="cruise_output">
                <p>Power</p>
                <Prettified value={Cruise.getPercentPower(getPressureAltitude(), rpm, Math.trunc(mp*10), temperature)} />
                
                <p>True Airspeed (kts)</p>
                <Prettified value={Cruise.getTrueAirspeed(getPressureAltitude(), rpm, Math.trunc(mp*10), temperature, weight)} />
                
                <p>Fuel Flow<br />100 ROP (gph)</p>
                <Prettified value={Cruise.getFuelFlow(getPressureAltitude(), rpm, Math.trunc(mp*10), temperature)} decimals={1} />
              </section>
          </NavSection>

          <NavSection visible={tabsMatch(["approach"])}>
              <section className="subheader">
                <p>Normal Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed (kts)</p>
                <Prettified value={NormalLanding.getApproachSpeed(weight)} />
                
                <p></p><p></p>
                
                <p>Ground roll (ft)</p>
                <Prettified value={NormalLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} />
                
                <p>50 ft obstacle (ft)</p>
                <Prettified value={NormalLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} />
              </section>             
              
              <section className="subheader">
                <p>Performance Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed (kts)</p>
                <Prettified value={PerformanceLanding.getApproachSpeed(weight)} />
                
                <p></p><p></p>
                
                <p>Ground roll (ft)</p>
                <Prettified value={PerformanceLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} />
                
                <p>50 ft obstacle (ft)</p>
                <Prettified value={PerformanceLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} />
              </section>  
          </NavSection>
        </div>
    );
}

export default App;

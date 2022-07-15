import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { NormalTakeoff, PerformanceTakeoff } from './models/Takeoff.js';
import { NormalLanding, PerformanceLanding } from './models/Landing.js';
import { Climb } from './models/Climb.js';
import { Cruise } from './models/Cruise.js';
import { Temps } from './models/Temps.js';

const NavSection = ({ visible, children }) => {
    if (visible) {
        return children;
    } else {
        return null;
    }
}

const InputWithSlider = ({ label, getter, setter, min, max, step, className, onClick }) => {
    return [
        <p className={className} onClick={onClick}>{label}</p>,
        <p className={className + " noscroll"}><input type="range" min={min} max={max} step={step} value={getter} onChange={e => setter(Number(e.target.value))} /></p>,
        <p className={className}><input type="text" inputMode="numeric" value={getter} onChange={e => setter(Number(e.target.value))} /></p>,
    ]
}

const Prettified = ({ value, decimals=0, unit='' }) => {
    if (value == null) {
        return <p className="invalid">⚠</p>
    } else {
        return <p>{Number(value).toFixed(decimals)} {unit}</p>
    }
}

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

const App = () => {

    const [emptyWeight, setEmptyWeight] = useState(1860);
    const [maxGrossWeight, setMaxGrossWeight] = useState(1860);
    
    const [subweights, setSubweights] = useState(false);
    const [subWeightPilot, setSubweightPilot] = useStickyState(190, "subWeightPilot");
    const [subWeightCopilot, setSubweightCopilot] = useStickyState(0, "subWeightCopilot");
    const [subWeightPassenger1, setSubweightPassenger1] = useStickyState(0, "subWeightPassenger1");
    const [subWeightPassenger2, setSubweightPassenger2] = useStickyState(0, "subWeightPassenger2");
    const [subWeightCargo, setSubweightCargo] = useStickyState(30, "subWeightCargo");
    const [subWeightFuel, setSubweightFuel] = useStickyState(64, "subWeightFuel");

    const [weight, setWeight] = useStickyState(2500, "weight");    
    
    const [indicatedAltitude, setIndicatedAltitude] = useStickyState(0, "indicatedAltitude");
    const [altimeterSetting, setAltimeterSetting] = useStickyState(29.92, "altimeterSetting");
    
    const [temperature, setTemperature] = useStickyState(0, "temperature");
    const [wind, setWind] = useStickyState(0, "wind");
    
    const [rpm, setRpm] = useStickyState(2600, "rpm");
    const [percentPower, setPercentPower] = useStickyState(65, "percentPower");
    
    const [currentTab, setCurrentTab] = useStickyState('config', "currentTab");
    
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
        return Math.round(indicatedAltitude + (29.92 - altimeterSetting) * 1000);
    }
    
    const getDensityAltitude = () => {
        var pressureAltitude = getPressureAltitude();
        var standardTemperature = Temps.getStandardTemperature(pressureAltitude);
        return Math.round(pressureAltitude + 120 * (temperature - standardTemperature));
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
                <NavButton tab="config">Configuration</NavButton>
                <NavButton tab="departure">Takeoff &amp; Climb</NavButton>
                <NavButton tab="cruise">Cruise</NavButton>
                <NavButton tab="approach">Approach &amp; Landing</NavButton>
            </div>

          <header className="header">
            <p>M20J Performance Calculator</p>
            <img className="App-logo" src="logo192.png" />
          </header>
          
          <section className="input">
            <NavSection visible={tabsMatch(["config"])}>
                <InputWithSlider label="Empty Weight" getter={emptyWeight} setter={setEmptyWeight} min="1700" max="2000" step="1" />
            </NavSection>
            
            <NavSection visible={tabsMatch(["departure", "cruise", "approach"])}>
                <InputWithSlider
                    label={"Weight (lbs): 0+" + (weight - emptyWeight) + " ℹ️"}
                    onClick={() => setSubweights(!subweights)}
                    getter={weight}
                    setter={setWeight}
                    min={emptyWeight} max="2740" step="10" />

                <NavSection visible={subweights}>
                    <InputWithSlider className="subsection" label="Pilot" getter={subWeightPilot} setter={setSubweightPilot} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Copilot" getter={subWeightCopilot} setter={setSubweightCopilot} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Passenger 1" getter={subWeightPassenger1} setter={setSubweightPassenger1} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Passenger 2" getter={subWeightPassenger2} setter={setSubweightPassenger2} min="0" max="400" step="10" />
                    <InputWithSlider className="subsection" label="Cargo" getter={subWeightCargo} setter={setSubweightCargo} min="0" max="400" step="10" />
                    <InputWithSlider
                        className="subsection"
                        label="Fuel (gals)"
                        getter={subWeightFuel}
                        setter={setSubweightFuel}
                        min="0" max="64" step="1"
                        onClick={() => setSubweightFuel(50)}/>
                </NavSection>
                
                <InputWithSlider
                    label="Indicated Altitude (ft)"
                    getter={indicatedAltitude}
                    setter={setIndicatedAltitude}
                    onClick={() => setIndicatedAltitude(0)}
                    min="0" max="16000" step="500" />

                <InputWithSlider
                    label="Altimeter Setting (inHg)"
                    getter={altimeterSetting}
                    setter={setAltimeterSetting}
                    onClick={() => setAltimeterSetting(29.92)}
                    min="29.60" max="30.40" step=".01" />

                <InputWithSlider
                    label="OAT (°C)"
                    getter={temperature}
                    setter={setTemperature}
                    onClick={() => {
                        var standardTemperature = Temps.getStandardTemperature(getPressureAltitude());
                        if (standardTemperature != null) {
                            setTemperature(Math.round(standardTemperature));
                        }
                    }}
                    min="-20" max="45" step="1" />
            </NavSection>

            <NavSection visible={tabsMatch(["departure", "approach"])}>
                <InputWithSlider
                    label="Headwind (kts)"
                    getter={wind}
                    setter={setWind}
                    onClick={() => setWind(0)}
                    defaultValue="0"
                    min="-10" max="20" step="1" />
            </NavSection>
          </section>

          <NavSection visible={tabsMatch(["departure", "cruise", "approach"])}>
              <section className="altitudes_output">
                 <p>Pressure Altitude</p>
                 <Prettified value={getPressureAltitude()} unit="ft" />
                 
                 <p>Density Altitude</p>
                 <Prettified value={getDensityAltitude()} unit="ft" />
              </section>
          </NavSection>
          <NavSection visible={tabsMatch(["departure"])}>
              <section className="subheader">
                <p>Normal Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed</p>
                <Prettified value={NormalTakeoff.getLiftoffSpeed(weight)} unit="kts" />
                
                <p>Ground roll</p>
                <Prettified value={NormalTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} unit="ft" />
                
                <p>50 foot speed</p>
                <Prettified value={NormalTakeoff.getFiftyFootSpeed(weight)} unit="kts" />
                
                <p>50 ft obstacle</p>
                <Prettified value={NormalTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} unit="ft" />
              </section>

              <section className="subheader">
                <p>High Performance Takeoff</p>
              </section>
              
              <section className="takeoff_output">
                <p>Takeoff speed</p>
                <Prettified value={PerformanceTakeoff.getLiftoffSpeed(weight)} unit="kts" />
                
                <p>Ground roll</p>
                <Prettified value={PerformanceTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} unit="ft" />
                
                <p>50 foot speed</p>
                <Prettified value={PerformanceTakeoff.getFiftyFootSpeed(weight)} unit="kts" />
                
                <p>50 ft obstacle</p>
                <Prettified value={PerformanceTakeoff.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} unit="ft" />
              </section>
              
              <section className="subheader">
                <p>Climb</p>
              </section>
                            
              <section className="climb_output">
                <p>Vy</p>
                <Prettified value={Climb.getVy(weight, getPressureAltitude())} unit="kts" />
                <p>Rate of climb</p>
                <Prettified value={Climb.getRate(getPressureAltitude(), temperature, weight)} unit="fpm" />
                <p className="explanation">Warning: climb performance is currently overestimated due to model limitations</p>                
              </section>
          </NavSection>
          
          <NavSection visible={tabsMatch(["cruise"])}>
              <section className="subheader">
                <p>Cruise</p>
              </section>

              <section className="input">
                <InputWithSlider
                    label="RPM"
                    getter={rpm}
                    setter={setRpm}
                    onClick={() => setRpm(2600)}
                    min="2000" max="2700" step="100" />
                
                <InputWithSlider
                    label="% Power"
                    getter={percentPower}
                    setter={setPercentPower}
                    onClick={() => setPercentPower(65)}
                    min="45" max="75" step="1" />
              </section>
          
              <section className="cruise_output">
                <p>MP</p>
                <Prettified value={Cruise.getMp(getPressureAltitude(), rpm, percentPower, temperature)} decimals="1" unit={"\""} />
                
                <p>True Airspeed</p>
                <Prettified value={Cruise.getTrueAirspeed(getPressureAltitude(), rpm, percentPower, temperature, weight)} unit="kts"/>
                
                <p>Fuel Flow 100ROP</p>
                <Prettified value={Cruise.getFuelFlow(getPressureAltitude(), rpm, percentPower, temperature)} decimals="1" unit="gph" />
              </section>
          </NavSection>

          <NavSection visible={tabsMatch(["approach"])}>
              <section className="subheader">
                <p>Normal Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed</p>
                <Prettified value={NormalLanding.getApproachSpeed(weight)} unit="kts"/>
                
                <p></p><p></p>
                
                <p>Ground roll</p>
                <Prettified value={NormalLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} unit="ft"/>
                
                <p>50 ft obstacle</p>
                <Prettified value={NormalLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} unit="ft"/>
              </section>             
              
              <section className="subheader">
                <p>Performance Landing</p>
              </section>
              
              <section className="landing_output">
                <p>Landing speed</p>
                <Prettified value={PerformanceLanding.getApproachSpeed(weight)} unit="kts" />
                
                <p></p><p></p>
                
                <p>Ground roll</p>
                <Prettified value={PerformanceLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 0)} unit="ft" />
                
                <p>50 ft obstacle</p>
                <Prettified value={PerformanceLanding.getDistance(getPressureAltitude(), temperature, weight, wind, /* obstacle= */ 1)} unit="ft" />
              </section>  
          </NavSection>
        </div>
    );
}

export default App;

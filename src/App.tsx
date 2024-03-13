import React, { useState } from 'react';
import Availability from './components/Availability/Availability';
import Personal from './components/Personal/Personal';
import './App.css';

function App() {
  const [step, setStep] = useState(1); // Step state to track which part of the form the user is on

  // Function to move to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Function to move to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Sign Up</h1>
      </header>
      <div className="form-container">
        {step === 1 && <Personal />} {/* Display Personal component if step is 1 */}
        {step === 2 && <Availability />} {/* Display Availability component if step is 2 */}
      </div>
      <div className="buttons">
        {step > 1 && <button onClick={prevStep}>Previous</button>} {/* Display previous button if step is greater than 1 */}
        {step < 2 && <button onClick={nextStep}>Next</button>} {/* Display next button if step is less than 2 */}
      </div>
    </div>
  );
}

export default App;

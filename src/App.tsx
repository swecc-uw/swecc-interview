import { useEffect, useState } from 'react';
import Availability from './components/Availability/Availability';
import Personal from './components/Personal/Personal';
import Welcome from './components/Welcome/Welcome';
import Confirmation from './components/Confirmation/Confirmation';
import { getNextMonday } from './utils/time';
import './App.css';

const renderWarning = (lastSignup: any) => {
  if (!lastSignup) return null;

  const nextMonday = getNextMonday(new Date());
  const lastSignupDateForWeekOf = new Date(lastSignup.dateForWeekOf);

  if (nextMonday.getDate() !== lastSignupDateForWeekOf.getDate())
    return null;

  return (
    <div className="warning">
      <h2>Warning</h2>
      <p>
        You have already signed up for a mock interview for this week. If you sign up again, your previous sign up will be overwritten.
      </p>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0); // Step state to track which part of the form the user is on
  const [lastSignup, setLastSignup] = useState(null); // State to store the last sign up data

  useEffect(() => {
    const lastSignupString = localStorage.getItem('lastSignup');
    if (lastSignupString) setLastSignup(JSON.parse(lastSignupString));
    else setLastSignup(null);
  }
  , []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mock Interview Sign Up</h1>
        <h2>for week of {getNextMonday(new Date()).toDateString()}</h2>
      </header>
      <div className="form-container">
        {step === 0 && <Welcome />} {/* Display Welcome component if step is 0 */}
        {step === 1 && <Personal />} {/* Display Personal component if step is 1 */}
        {step === 2 && <Availability />} {/* Display Availability component if step is 2 */}
        {step === 3 && <Confirmation />} {/* Display Confirmation component if step is 3 */}
      </div>
      <div className="buttons">
        {step > 1 && <button onClick={prevStep}>Previous</button>} {/* Display previous button if step is greater than 1 */}
        {step > 0 && step < 3 && <button onClick={nextStep}>Next</button>} {/* Display next button if step is less than 2 */}
        {step === 0 && <button onClick={nextStep}>Sign Up</button>} {/* Display start button if step is 0 */}
      </div>
      {renderWarning(lastSignup)} {/* Display warning message */}
    </div>
  );
}

export default App;

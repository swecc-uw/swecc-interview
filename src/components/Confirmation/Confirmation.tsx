import { SignupData } from "../../types"
import { submitSignup } from "../../services/signup";
import { getNextMonday } from "../../utils/time";
import './Confirmation.css';


const readSignupDataFromLocalStorage = (): SignupData => {
  const availability = JSON.parse(localStorage.getItem('availability') || '[]');
  const personal = JSON.parse(localStorage.getItem('personal') || '{}');

  return {
    availability,
    ...personal
  };
}

function Confirmation() {
  const signupData = readSignupDataFromLocalStorage();

  const handleSubmit = async () => {
    await submitSignup(signupData);
    const nextMonday = getNextMonday(new Date());

    localStorage.setItem('lastSignup', JSON.stringify({
      ...signupData,
      date: nextMonday.toDateString(),
      dateForWeekOf: nextMonday.toDateString()
    }));
  }

  return (
    <div className="confirmation-container">
      <h3> Does your personal data look correct?</h3>
      <p>First Name: {signupData.firstName}</p>
      <p>Last Name: {signupData.lastName}</p>
      <p>Email: {signupData.email}</p>
      <p>Discord: {signupData.discord}</p>
      <button className="submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Confirmation;
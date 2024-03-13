import { useEffect, useState } from "react";
import './Personal.css';


const Personal = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');

  useEffect(() => {
    const personal = localStorage.getItem('personal');
    if (personal) {
      const data = JSON.parse(personal);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setDiscord(data.discord);
    }
  }, []);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDiscordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscord(e.target.value);
  };

  const handleSave = () => {
    if (!firstName || !lastName || !email || !discord) return;

    if (email.split('@')[1] !== 'uw.edu')
        return alert('Please use your UW email');

    localStorage.setItem('personal', JSON.stringify({
      firstName,
      lastName,
      email,
      discord
    }));
  };

  return (
    <div className="personal-container">
      <label className="input-label">
        First Name:
        <input className="input-field" value={firstName} onChange={handleFirstNameChange} />
      </label>
      {/* <br /> */}
      <label className="input-label">
        Last Name:
        <input className="input-field" value={lastName} onChange={handleLastNameChange} />
      </label>
      {/* <br /> */}
      <label className="input-label">
        UW Email:
        <input className="input-field" value={email} onChange={handleEmailChange} />
      </label>
      {/* <br /> */}
      <label className="input-label">
        Discord:
        <input className="input-field" value={discord} onChange={handleDiscordChange} />
      </label>
      {/* <br /> */}
      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
};

export default Personal;

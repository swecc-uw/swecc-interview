import React from 'react';
import { SetStateAction } from 'react';
import api from '../../services/api';

const PairInterviewDashboard: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [signal, setSignal] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<string>('');

  const handleClick = () => {
    setLoading(true);
    setSignal(!signal);
    api
      .post('/interview/pair/', { signal })
      .then((res: { data: SetStateAction<string> }) => {
        setResponse(res.data);
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const display = JSON.stringify(response);
  return (
    <div className="container mt-3">
      <h1>Pair Interview Pool Dashboard</h1>
      <p>Click the button to toggle the pair interview pool.</p>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Toggle Pair Interview Pool'}
      </button>
      <p>{display}</p>
    </div>
  );
};

export default PairInterviewDashboard;

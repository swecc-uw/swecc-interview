import { useEffect, useState } from "react";


interface LeetcodeProfileProps {
  username: string;
}

interface Stats {
  easy: number;
  medium: number;
  hard: number;
}

const LeetcodeProfile = ({ username }: LeetcodeProfileProps) => {
  const [submissions, setSubmissions] = useState<Stats | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`)
      .then(response => response.json()) // Convert the response to JSON format
      .then(data => {
        const { easySolved: easy, mediumSolved: medium, hardSolved: hard } = data;
        setSubmissions({ easy, medium, hard });
      }).catch(error => {
        console.error(error);
        setSubmissions({ easy: 0, medium: 0, hard: 0 });
      });
        }
    fetchProfile().then(() => setLoading(false));
  }
  , [loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {submissions === undefined ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{username}</h1>
          <p>Total: {submissions?.easy + submissions?.medium + submissions?.hard}</p>
          <p>Easy: {submissions?.easy}</p>
          <p>Medium: {submissions?.medium}</p>
          <p>Hard: {submissions?.hard}</p>
        </div>
      )}
    </div>
      );
}

export default LeetcodeProfile;

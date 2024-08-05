import React from "react";

const API_URL = "http://localhost:8000";

const ProtectedPage: React.FC = () => {
  const whoami = async (): Promise<void> => {
    console.log("WhoAmI");
    try {
      const res = await fetch(`${API_URL}/api/user/whoami/`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
      }

      const data: { username: string } = await res.json();
      console.log("You are logged in as: " + data.username);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="container mt-3">
      <h1>React Cookie Auth</h1>
      <p>You are logged in!</p>
      <button onClick={whoami}>
        WhoAmI
      </button>
    </div>
  );
};

export default ProtectedPage;

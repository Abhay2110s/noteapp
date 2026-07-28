import { useEffect, useState } from "react";
import API from "./api/axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via cookie on mount
    API.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? <h1>Welcome back, {user.username}!</h1> : <h1>Please Login or Register</h1>}
    </div>
  );
}

export default App;
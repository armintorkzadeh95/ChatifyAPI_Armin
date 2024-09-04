import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [decodedJwt, setDecodedJwt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetch("https://chatify-api.up.railway.app/csrf", { method: "PATCH" })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCsrfToken(data.csrfToken);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("https://chatify-api.up.railway.app/auth/token", { method: 'POST', headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          csrfToken: csrfToken,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log("Kunde ej hitta användare,", data.error);
          setError(data.error);
        } else {
          console.log("Inloggning lyckades");
          localStorage.setItem('userToken', data.token);
          setError("");
          setUser("Inloggning Lyckades, un momento!");

          const decodedJwt = JSON.parse(atob(data.token.split('.')[1]));
          setDecodedJwt(decodedJwt);

          setTimeout(() => {
            navigate('/chat');
          }, 1000);
        }
      });
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Logga in</h1>
        {error && <p>{error}</p>}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Logga in</button>
      </form>
      {decodedJwt && (
        <div>
          <h2>Decoded JWT:</h2>
          <pre>{JSON.stringify(decodedJwt, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Login;
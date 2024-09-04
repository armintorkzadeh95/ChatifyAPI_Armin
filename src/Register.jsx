import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Hämta CSRF token
    fetch("https://chatify-api.up.railway.app/csrf", { method: "PATCH" })
    .then(res => res.json())
    .then(data => {console.log(data)
      setCsrfToken(data.csrfToken)
    })}, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindrar standard sidanladdning
    fetch("https://chatify-api.up.railway.app/auth/register", { method: 'POST', headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          csrfToken: csrfToken,
          username: username,
          password: password,
          email: email,
          avatar: avatar,
        })
      })
      .then(res => res.json())
      .then(data => {

        if (data.error)
        {
          console.log("Kunde ej registreras,", data.error)
          setError(data.error)
        }
        else
        {
          console.log("Registrering lyckades")
          localStorage.setItem('userToken', data.token)
          setError("")
          setSuccess("Registrering Lyckades, un momento!")
        setTimeout(() => {
          navigate('/login');
        }, 1000)
  }
})

const getAvatar = () => {
  const avatarId = Math.floor(Math.random() * 70) + 1;
  return `https://o.pravatar.cc/200?img=${avatarId}`
}
const handleAvatar = () => {
  setAvatar(getAvatar());
};

const nextLogin = () =>
{
  navigate('/login')
}
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrera</h1>
      <input type="text" placeholder="Avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)}/>
      <br />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <br />
      <button type="submit">Registrera</button>
      
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
}

export default Register;
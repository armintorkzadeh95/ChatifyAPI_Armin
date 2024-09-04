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

      const nextRegister = () =>
        {
          navigate('/register');
          };

  return (
    <div className="hero min-h-screen"
      style={{
        backgroundImage: 
        "url(https://c4.wallpaperflare.com/wallpaper/165/383/672/halo-video-games-halo-infinite-xbox-wallpaper-preview.jpg)",
      }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content flex-col text-white">
        <div className="text-justify-start lg:text-top">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Login if you want to chat!</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input type="text" placeholder="Username" className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-warning">Login</button>
            </div>
            <div className="form-control mt-4">
              <button type="button" className="btn btn-link" onClick={nextRegister}>Dont have account?</button>
            </div>
          </form>
        </div>
      </div>
      {decodedJwt && (
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">Decoded JWT:</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(decodedJwt, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Login;
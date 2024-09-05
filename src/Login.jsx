import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [decodedJwt, setDecodedJwt] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true)
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
          setLoading(false);
        } else {
          console.log("Inloggning lyckades");
          localStorage.setItem('userToken', data.token);
          setError("");
          setUser("Inloggning Lyckades, un momento!");

          const decodedJwt = JSON.parse(atob(data.token.split('.')[1]));
          setDecodedJwt(decodedJwt);

          setTimeout(() => {
            setLoading(false)
            navigate('/chat');
          }, 1000);
        }
      });
    }

      const nextRegister = () =>
        {
          navigate('/register');
          };

          if (loading) {
            return (
              <div className="flex items-center justify-center w-full h-full">
                <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                  <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                    <path clip-rule='evenodd'
                      d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                      fill='currentColor' fill-rule='evenodd' />
                  </svg>
                  <div>Loading ...</div>
                </div>
              </div>
            )
          }

  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    backgroundImage: "url(https://wallpapercat.com/w/full/3/b/3/728251-3840x2160-desktop-4k-halo-ring-background-image.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }} >
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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", { method: "PATCH" })
    .then(res => res.json())
    .then(data => {console.log(data)
      setCsrfToken(data.csrfToken)
    })}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://chatify-api.up.railway.app/auth/register", { method: 'POST', headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          avatar: avatar,
          csrfToken: csrfToken,
          username: username,
          password: password,
          email: email,
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
});
  };

  const handleAvatar = () => {
    document.getElementById('avatarInput').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

const nextLogin = () =>
{
  navigate('/login');
  };


  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        width: "100%",
        height: "104%",
        backgroundImage:
          "url(https://wallpapercat.com/w/full/3/b/3/728251-3840x2160-desktop-4k-halo-ring-background-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="hero-overlay bg-opacity-60 absolute top-0 left-0 w-full h-full"></div>
      <div className="hero-content flex-col text-white relative z-10 mb-auto">
      <div className="text-center ">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">Create your account to start your journey!</p>
        </div>
        <div className="card bg-base-100 w-full h-auto shrink-4 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control text-center my-2">
              <img src={preview || 'https://via.placeholder.com/150'} alt="Avatar Preview" width="150" height="150" className="my-4 mx-auto" />
              <button type="button" className="btn btn-warning" onClick={handleAvatar}>Choose your avatar</button>
              <input type="file" id="avatarInput" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Username</span>
                    </label>
              <input type="text" placeholder="Username" className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-warning">Register</button>
            </div>
            <div className="form-control">
              <button type="button" className="btn btn-link" onClick={nextLogin}>Have an account?</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
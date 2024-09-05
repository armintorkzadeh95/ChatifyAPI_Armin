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
});
  };

  // Function to handle avatar selection
  const handleAvatar = () => {
    document.getElementById('avatarInput').click(); // Trigger file input click
  };

  // Handle file input change event
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file); // Store the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

const nextLogin = () =>
{
  navigate('/login');
  };


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
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">Create your account to start your journey!</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control text-center">
              <h2 className="text-xl">Choose your Avatar!</h2>
              <img src={preview || 'https://via.placeholder.com/150'} alt="Avatar Preview" width="150" height="150" className="my-4 mx-auto" />
              <button type="button" className="btn btn-warning mb-4" onClick={handleAvatar}>Choose your avatar</button>
              <input type="file" id="avatarInput" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <input type="text" placeholder="Avatar" value={avatar ? avatar.name : 'No file chosen'} readOnly className="input input-bordered mb-4" />
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
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-warning">Register</button>
            </div>
            <div className="form-control mt-4">
              <button type="button" className="btn btn-link" onClick={nextLogin}>Have an account?</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
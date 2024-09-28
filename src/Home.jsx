import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home () {
const navigate = useNavigate();


    const nextRegister = () =>
        {
          navigate('/register');
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
                  height: "93%",
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
      <div className="hero-content flex-col text-white relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Welcome to Armin's ChatifyAPI <br /> Halo Edition</h1>
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2 size-96 m-8">
              <img src="https://avatarfiles.alphacoders.com/327/327168.jpg" alt="Avatar" />
            </div>
          </div>
          <p className="py-6 px-8">
          Log in or sign up to chat. If you already have an account, just log in and start chatting with Master Chief!
          </p>
          <button onClick={nextRegister} className="btn btn-warning">
            Sign Up
          </button>
          <button onClick={nextLogin} className="btn btn-warning ml-4">
            Log In
          </button>
                  </div>
                </div>
              </div>
            );
          }
export default Home;
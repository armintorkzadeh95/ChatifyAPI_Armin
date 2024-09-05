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
                  <div className="hero min-h-screen"
                    style={{
                      backgroundImage: "url(https://c4.wallpaperflare.com/wallpaper/165/383/672/halo-video-games-halo-infinite-xbox-wallpaper-preview.jpg)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }} >
                       <div className="hero-overlay bg-opacity-60"></div>
                      <div className="hero-content flex-col text-white">
                        <div className="text-justify-start lg:text-top">
                          <h1 className="text-5xl font-bold">Welcome to Armin's ChatifyAPI</h1>
                          <div className="avatar">
              <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2 size-96 m-8">
                <img src="https://avatarfiles.alphacoders.com/327/327168.jpg" />
              </div>
              </div>
                          <p className="py-6 px-8">
                            To chat, please log in or sign up. If you don’t have an account yet, it’s quick and easy to register. 
                            If you already have an account, just log in and start chatting!
                          </p>
                          <button onClick={nextRegister} className="btn btn-warning">Sign Up</button>
                          <button onClick={nextLogin} className="btn btn-warning ml-4">Log In</button>
                        </div>
                      </div>
                    </div>
            );
        }

export default Home;
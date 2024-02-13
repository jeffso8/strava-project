import React, { useState, useEffect} from 'react';
import axios from "axios";
import { parse } from 'path';
import { parsed } from 'yargs';
import Cookies from 'js-cookie';
import { redirect, useNavigate } from 'react-router-dom';
import {PropagateLoader} from 'react-spinners';

function Login() {
    
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let clientID = "114519";
  const authURL = `http://www.strava.com/api/v3/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=http://localhost:3000/&approval_prompt=force&scope=read_all,activity:read_all,profile:read_all`
  let parsedAuthCode = "";

  // Function to extract the value of "code" from the URL
  function extractAuthCode(url) {
    const match = url.match(/code=([^&]+)/);
    return match && match[1];
  }

  useEffect(() => {
    const fetchAuthData = async () => {
      const params = new URLSearchParams(window.location.href);
      const accessToken = Cookies.get('accessToken');
      if (params.get('code')) {
        parsedAuthCode = extractAuthCode(window.location.href)
        // get auth code and post request to get refresh token
        // after getting refresh token, make another request to get access token
        setLoading(true);
        const authResponse = await fetch("/auth-code", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({authCode: parsedAuthCode})
        })

        const authResponseJSON = await authResponse.json();
        Cookies.set('authCode', authResponseJSON.authCode, {expires: 5})

        const profileData = await fetch(`/get-access-token/?authCode=${authResponseJSON.authCode}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        
        const profileDataJSON = await profileData.json();

        Cookies.set('accessToken', profileDataJSON.externalData.access_token);
        Cookies.set('refreshToken', profileDataJSON.externalData.refresh_token);
        setLoading(false);
        
        if (profileDataJSON) {
          navigate("/dashboard")
        }
    }
  }
    fetchAuthData();  
 }, [window.location.href])

  return (
    <div className="Login">
      <header className="App-header">
          {loading ? 
          <PropagateLoader /> : 
          <button class="btn" onClick={() => window.location.assign(authURL)}>Authorize</button>}
      </header>
    </div>
  )
};

export default Login;
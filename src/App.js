import React, { useState } from 'react'
import axios from "axios";
import logo from './logo.svg';
import './App.css';

function App() {

 const [profileData, setProfileData] = useState(null)

 function getData() {
   axios({
     method: "GET",
     url:"/profile",
   })
   .then((response) => {
     const res=response.data
     setProfileData(({
       profile_name: res.name,
       about_me: res.message}))
   }).catch((error) => {
     if (error.response) {
       console.log(error.response)
       console.log(error.response.status)
       console.log(error.response.headers)
       }
   })}
  
  function printData() {
    console.log("name: ", profileData.profile_name)
    console.log("message: ", profileData.about_me)
  }

 return (
   <div className="App">
     <header className="App-header">
       <img src={logo} className="App-logo" alt="logo" />
       <p>
         Edit <code>src/App.js</code> and save to reload.
       </p>
       <p>To get your profile details: </p><button onClick={getData}>Click me</button>

       {profileData && <div>
             <p>Profile name: {profileData.profile_name}</p>
             <p>About me: {profileData.about_me}</p>
           </div>
       }
     </header>
   </div>
 );
}

export default App;

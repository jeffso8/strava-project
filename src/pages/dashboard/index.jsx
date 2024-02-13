import React, { useState, useEffect} from 'react';
import { parse } from 'path';
import { parsed } from 'yargs';
import Cookies from 'js-cookie';

function Dashboard() {

  const [athleteActivities, setAthleteActivities] = useState([]);

   // use current access token to call all activities
  function getActivities() {
    const accessToken = Cookies.get('accessToken');
    console.log('getactivities', accessToken);
    fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
      })      
      .then(res => res.json())
      .then((data) => setAthleteActivities(data.map((d) => d.name)))
      .catch(e => console.log(e))
  }

    return (
        <>
        <div>"ACTIVITIES"</div>
        <button class="btn" onClick={() => getActivities()}>Get Activities </button>
        {athleteActivities.map((activity) => {
          return (<h1>{activity}</h1>);
        })}
        </>
    )
}

export default Dashboard;
const isStravaTokenExpired = (currentExpirationTime) => {
  const currentEpochTime = Date.now();
  if (currentExpirationTime === 'undefined') {
      return `There is an error with the currentEpirationTime, it's value is: ${currentExpirationTime}.`
  }
  return currentEpochTime > currentExpirationTime;
}

const generateNewToken = async () => {
  console.log('Generating new token...');
  const requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };
  const requestURL = `https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=ReplaceWithRefreshToken&refresh_token=${process.env.STRAVA_CACHED_REFRESH_TOKEN}`;

  try {
      let response = await fetch(requestURL, requestOptions);
      response = await response.json(); 
      if (response.message === 'Bad Request') {
        console.log(response);
          return;
      }
      return {
          refreshToken: await response.refresh_token, 
          expirationTime: await response.expires_at,
          accessToken: await response.access_token
      }
  } catch (error) {
      console.log(error);
  }

}


const persistNewTokenData = async (newTokenData) => {
  // Update the relevant key with the new value
  process.env.STRAVA_EXPIRATION_TIME = newTokenData.expirationTime
  process.env.STRAVA_CACHED_REFRESH_TOKEN = newTokenData.refreshToken
  process.env.STRAVA_CACHED_TOKEN = newTokenData.accessToken
};



const getStravaActivityData = async () => {
  console.log('Requesting activity data from Strava...');
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.STRAVA_CACHED_TOKEN}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
      const response = await fetch("https://www.strava.com/api/v3/athlete/activities", requestOptions);
      return response.json();

  } catch (error) {
      console.log('error', error)
  }   
}

//check to see if the expiration time has passed
const executeStravaLogic = async () => {
  const isTokenExpired = isStravaTokenExpired(process.env.STRAVA_EXPIRATION_TIME);

  if (typeof isTokenExpired === 'string') {
      console.log('Please resolve the error with the current expiration time stored in the .env file.');
      return;
  } else if (isTokenExpired) {
      console.log('The expiration time has passed. Generating a new token...');
      //if yes - generate a new token
      const newTokenData = await generateNewToken();
      if (!newTokenData.expirationTime) {
          console.log('There was an error getting refresh token data.')
          return;
      } 
      //save the new token info to .env
      persistNewTokenData(newTokenData);

  } 
  //make request to Strava activities endpoint
  const stravaActivityData = await getStravaActivityData();
  return stravaActivityData;
};


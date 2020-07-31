const request = require('request');

///////////////// Attempt to make code work was unsuccesful /////////////////////////////
// /**
//  * Makes a single API request to retrieve the user's IP address.
//  * Input:
//  *   - A callback (to pass back an error or the IP string)
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The IP address as a string (null if error). Example: "162.245.144.188"
//  */
// const fetchMyIP = function(callback){ 
//     // use request to fetch IP address from JSON API
//     request('https://api.ipify.org?format=json', (error, response, body) => {

//     if (error){ 
//       return callback(error, null);
//     }

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);

//       return;
//     }

//     const ip = JSON.parse(body).ip;

//     callback(null, ip);
//   });

// };

// module.exports =  { fetchMyIP } ;

// const fetchCoordsByIP = (ip, callback) => {
//     //fetch url data
//     const url = `https://ipvigilante.com/${ip}`; //This API doesn't seem to work anymore

//     request(url, (error, resp, body) => {

//         //console.log(body)

//         // check for errors //
//         if (error) {
//         callback(error, null);
//         return;
//         }
//       // if non-200 status, assume server error
//         if (resp.statusCode !== 200) {
//         const msg = `Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`;
//         callback(Error(msg), null);
//         return;
//         }

//         //Create the object that passes both lat and long to new obj
       

//        const locData = JSON.parse(body);
//        console.log(locData);//?
//        const lat = locData.data.latitude;
//        const long = locData.data.longitude;
//        let geoLoc = {lat, long};
//        console.log(geoLoc)
//        callback(null, geoLoc);
       

//     });

// };

// module.exports = { fetchCoordsByIP };

// /**
//  * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
//  * Input:
//  *   - An object with keys `latitude` and `longitude`
//  *   - A callback (to pass back an error or the array of resulting data)
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The fly over times as an array of objects (null if error). Example:
//  *     [ { risetime: 134564234, duration: 600 }, ... ]
//  */
// const fetchISSFlyOverTimes = function(coords, callback) {

//   let lat = coords.latitude;
//   let long = coords.longitude

//   let url2 =  `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${long}`;

//   request(url2, (err , resp, body) => {

//     //console.log(body)//?

//     // Creat error checks//

//     if (err) {
//       callback(err, null);
//       return;
//       }
//     // if non-200 status, assume server error
//       if (resp.statusCode !== 200) {
//       const msg = `Status Code ${resp.statusCode} when fetching coordinates for Fly over time. Response: ${body}`;
//       callback(Error(msg), null);
//       return;
//       }

//     // Like previously we create the object that passes new obj

//     const data = JSON.parse(body);
//     let riseTime = data.response[0].risetime;
//     let durationTime = data.response[0].duration;
//     let flyOverLoc = {riseTime, durationTime}

//     console.log(flyOverLoc); //?

//     callback(null, flyOverLoc);


//   })
//   // ...
// };
// //test fuction if its working

// //fetchCoordsByIP('8.8.8.8', ()=>{});
// //fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, () =>{})
// //Error handling test 

// //fetchISSFlyOverTimes({ lude: '4.27670', loitude: '-12.13000' }, () =>{})

//module.exports = { fetchISSFlyOverTimes };

/////////////////////////////////Using solution to attempt to figure out why previous code does not work ////////////////////////
 
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;
    // console.log('lat/lng data:', { latitude, longitude });

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
  
}

module.exports = { nextISSTimesForMyLocation }
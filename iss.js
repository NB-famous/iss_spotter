const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback){ 
    // use request to fetch IP address from JSON API
    request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    console.log(ip)
    callback(null, ip);
  });
}

const fetchCoordsByIP = (ip, callback) => {
    //fetch url data
    const url = `https://ipvigilante.com/${ip}`;

    request(url, (error, resp, body) => {

        //console.log(body)

        // check for errors //
        if (error) {
        callback(error, null);
        return;
        }
      // if non-200 status, assume server error
        if (resp.statusCode !== 200) {
        const msg = `Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
        }

        //Create the object that passes both lat and long to new obj
       

       const locData = JSON.parse(body);
       console.log(locData);//?
       const lat = locData.data.latitude;
       const long = locData.data.longitude;
       let geoLoc = {lat, long};
        console.log(geoLoc)//?
       callback(null, geoLoc);
        //?

    });

};

//test fuction if its working

fetchCoordsByIP('8.8.8.8', ()=>{})
 
  module.exports = { fetchMyIP };
  module.exports = { fetchCoordsByIP };
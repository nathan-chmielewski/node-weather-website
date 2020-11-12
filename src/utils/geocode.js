const request = require('request')

// Geocoding
// User enters address, forward geocoding api (mapbox) converts to lat/long, 
// use that to request weather api

// geocode function takes address to get latitude, longitude of
// and callback function to call with lat/long data
const geocode = (address, callback) => {
    // Create dynamic url string with address
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) +  
    '.json?access_token=pk.eyJ1IjoiYnJpZ2h0c2lkZW5hdGUiLCJhIjoiY2toYjEzeXB1MDlmazJ5cGM3czBnY2RkaCJ9.tRr79obLuFG-by7NnvS7NA&limit=1'

    request({
        url,
        json: true
    // If error occurs, cannot destructure undefined, so provide default empty object in parameter list
    }, (error, { body } = {}) => {
        if (error) {
            callback('No network connection. Unable to connect to geolocation service.', undefined)
        } else if(body.features.length === 0) {
            callback('Unable to find geolocation. Try a new search.', undefined)
        } else {
            const data = {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                place_name: body.features[0].place_name
            }
            callback(undefined, data)
        }
    })
}

// Export geocode function
module.exports = geocode


// const geocodeURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/New%20York%20City%20New%20York.json?access_token=pk.eyJ1IjoiYnJpZ2h0c2lkZW5hdGUiLCJhIjoiY2toYjEzeXB1MDlmazJ5cGM3czBnY2RkaCJ9.tRr79obLuFG-by7NnvS7NA&limit=1"

// request({
//     url: geocodeURL,
//     json: true
// }, (error, response) => {
//     if (error) {
//         console.log(chalk.red.inverse('No network connection. Unable to connect to geolocation service.'))
//     } 
//     // If mapbox cannot find the place using the search terms, the features array returns empty
//     else if (response.body.features.length === 0) {
//         console.log(chalk.red.inverse('Unable to find geolocation. Try a new search.'))
//     } else {
//         console.log(chalk.yellowBright('Longitude: ' + response.body.features[0].center[0] +
//             ', Latitude: ' + response.body.features[0].center[1]))
//     }
// })
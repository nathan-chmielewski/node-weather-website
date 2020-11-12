const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=244a513d2c2d050663c235342918b6a5&query=' +
    latitude + ',' + longitude + '&units=f'

    request({
        url,
        json: true
        // If error occurs, cannot destructure undefined, so provide default empty object in parameter list
    }, (error, { body } = {}) => {
        if (error) {
            callback('No network connection. Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location. Please specify a valid location.', undefined)
        } else {
            const data = body.current.weather_descriptions[0] + '. It is currently ' + 
            body.current.temperature + ' degrees. It feels like ' +
            body.current.feelslike + ' degrees.' + ' The humidity is ' + body.current.humidity + 
            '%, and the wind speed is ' + body.current.wind_speed + ' mph.'
            // const data = {
            //     description: body.current.weather_descriptions[0],
            //     temperature: body.current.temperature,
            //     feelslike: body.current.feelslike
            // }
            callback(undefined, data)
        }
    })
}

// Export forecast function
module.exports = forecast


// API call for current weather
// query access_key, query (location in lat, long), units

// Make weatherstack api request
// first argument is options object - provide URL and other info
// second argument - function/callback to run after response 
// callback takes two args, error and response - only one will be instantiated, the other will be undefined
// request({
//     url: weatherstackURL,
//     json: true // parses JSON data, response arg will be parsed JSON object
// }, (error, response) => {
//     if (error) {
//         console.log(chalk.red.inverse('No network connection. Unable to connect to weather service.'))
//     } else if (response.body.error) {
//         console.log(chalk.red.inverse('Unable to find location. Specify a valid location.'))

//     } else {
//         // console.log(response.body.current)
//         console.log(chalk.blueBright(response.body.current.weather_descriptions[0] +
//             '. It is currently ' + response.body.current.temperature +
//             ' degrees out. It feels like ' + response.body.current.feelslike + ' degrees out.'))
//     }
// })
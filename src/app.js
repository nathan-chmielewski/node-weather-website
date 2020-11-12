// Core node module path provides utilities for manipulating directory/file paths
// REMEMBER no need to install core node modules
const path = require('path')
// Express is a single function called to create a new express application
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define paths for Express config
// Node provided vars that provide directory path and file path
// console.log(__dirname)
// path.join(...) returns final path, takes pieces of path to put together
// Get path to 'public' directory
const publicDirPath = path.join(__dirname, '../public')
const templatesDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

// In console, run app.js while in web-server folder 
// by doing node /src/app.js
// rather than being in src
// or express will look for hbs views folder in src
const app = express()

// Heroku port - access via environment variable value, or if locally run, 3000
const port = process.env.PORT || 3000

// Setup Handlebars engine and views location
// Installed Handlebars (hbs) templating engine, set in express
// Express expects handlebars templates to live in dir called views
app.set('view engine', 'hbs')
// Customize views folder, renamed to templates, using dir path
app.set('views', templatesDirPath)
// Setup dir for Handlebar partials
hbs.registerPartials(partialsDirPath)

// Setup static dir to serve
// Have express serve up public dir
// app.use(...) to customize server to serve up public dir
// express.static(...) takes path to dir we want to serve up
app.use(express.static(publicDirPath))

// Configure express app via methods

// Route handlers
// To serve up handlebar template, need to serve up route
app.get('', (req, res) => {
    // render(...) method to render a view
    // we configured express is configured to use hbs view engine
    // so we can render one of our handlebar templates
    // arg is string of file name without extension
    // render gets index.hbs and converts it to html to send back to requester
    // to provide a value accessible in the template, provide 2nd arg object
    // of all values for view to access
    res.render('index', {
        title: 'Weather app',
        name: 'Nate'
    })
})

// Configure what the server does when the user requests resources from a specific url
// get(...) takes two args: route, function to execute when route is requested
// function takes two args: req: object containing info about incoming request
// and response (res) which contains methods to customize what to send back
// app.get('', (req, res) => {
    // Send something back to requester
    // String will display in browser if requested from browser
    // If request is from code (using npm request lib) they will get this string back
    // Use send(...) method to send back HTML to be rendered by the browser
    // or JSON data designed to be consumed by code
//     res.send('<h1>Hello express</h1>')
// })

// app.get('/help', (req, res) => {
    // To send back JSON, provide an object or array as the value to send
    // Express detects the object and stringify's it into JSON data
//     res.send([{
//         name: 'Nathan',
//         age: 32
//     }, {
//         name: 'Kathleen',
//         age: 35
//     }])
// })

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Nate',
        helpText: 'You\'re my only hope'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Nate'
    })
})

app.get('/weather', (req, res) => {
    // string query is passed along with request
    // express parses this query string into an object, req.query
    // Catch if no search term    
    if (!req.query.address) {
        return res.send({
            error: 'No valid address provided. Pleas provide a valid address.'
        })
    }

    // Call geocode(...) with query string address to get data from mapbox api
    geocode(req.query.address, (error, { latitude, longitude, place_name } = {}) => {
        if (error) {
            return res.send({
                error
            })
        } 
        // Call weatherstack api via forecast(...) using lat/long from geocode
        // Input for forecast(...) comes from the output from geocode(...)
        // Return JSON object with weather data
        forecast(latitude, longitude, (error, forecastData) => { 
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                place_name,
                forecastData
            })
        })
    })
})

// app.get('/products', (req, res) => {
    // string query is passed along with request
    // express parses this query string into an object, req.query
    // Catch if no search term
//     if (!req.query.search) {
//         return res.send({
//             error: 'No search term provided. Please provide a search term.'
//         })
//     } 
//     console.log(req.query)
//     res.send({
//         products: []
//     })
// })

// Catch for /help 404s
// Catch any route from /help page that is not defined
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nate',
        errorMsg: 'Help page not found.'
    })
})

// Catch generic 404s
// Catch any route that is not handled using * -wildcard character
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nate',
        errorMsg: 'Page not found'
    })
})

// Start up the server
// 3000 - common dev port
// optional callback arg - runs when server is up and running
// Running server is an asynch process
app.listen(port, () => {
    console.log('Server up on port ' + port)
})
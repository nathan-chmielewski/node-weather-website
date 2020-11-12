// Client-side javascript that will run in the browser

/*
// Fetch api, browser-based api, not accessible in node.js
// first arg is url string to fetch from 
// asynch io operation, define callback function in then method on the return value from fetch
// Callback has response parameter, JSON data
fetch('http://localhost:3000/weather?address=Paris').then((response) => {
    // Call then() method on json() return value to execute callback function defined
    // in then when json data arrives and is parsed
    // JSON data as js object is only arg in then callback
    response.json().then((data) => {
        // If geocode() or forecast() api calls return an error, print error
        if (data.error) {
            return console.log(data.error)
        }
        // Successful geocode(), forecast() api calls
        // Print json data from object
        console.log(data.place_name)
        console.log(data.forecastData)
    })
})
*/

// Target element from HTML document
// Pass string name of element
// Returns js representation of the element
const weatherForm = document.querySelector('form')

// Select user input text from HTML input element
const searchText = document.querySelector('input')

// Target paragraph elements by id
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

// Set text content on paragraph elements
// messageOne.textContent = 'Message-1'

// Add event listener onto element
// addEventListener takes 2 args, string name of event to listen for, 
// and callback function to run when event occurs
// Callback takes one arg, event
weatherForm.addEventListener('submit', (event) => {
    // Prevent default before to refresh browser on submit
    // by calling preventDefault()
    event.preventDefault()

    // Set message-1 and message-2 text
    messageOne.textContent = 'Loading forecast...'
    messageTwo.textContent = ''
    // Access text from user input through value property of search
    // const location = searchText.value
    // const url = 'http://localhost:3000/weather?address=' + location
    fetch('/weather?address=' + searchText.value).then((response) => {
        response.json().then((data) => {
            if (data.error) { 
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.place_name
                messageTwo.textContent = data.forecastData
            }
        })
    })
})

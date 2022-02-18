const fahrenheitOpt = document.querySelector('#fahrenheit')
const celsiusOpt = document.querySelector('#celsius')
const inputBox = document.querySelector('.input-box')
const inputBtn = document.querySelector('.input-btn')

let timeZone = document.querySelector('#time-zone')
let city = document.querySelector('h1')
let currentTemp = document.querySelector('#temp')
let feelsLike = document.querySelector('#feels-like')
let conditions = document.querySelector('#conditions')
let currentIcon = document.querySelector('#current-icon')
let humid = document.querySelector('#humid')
let cloud = document.querySelector('#cloud')

let weekDays = document.querySelectorAll('.week-day')
let dailyIcons = document.querySelectorAll('.weather-icon')
let dailyHighs = document.querySelectorAll('.daily-high')
let dailyLows = document.querySelectorAll('.daily-low')


inputBtn.addEventListener('click', () => {
    results()
    inputBox.value = ''
})

inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        results()
        inputBox.value = ''
    }
})

//  GET DAY NAME FUNCTION
const getWeekDay = (unix) => {
    let myDate = new Date( unix * 1000 )
    let dateString = myDate.toDateString()
    let splitDate = dateString.split(' ')
    return splitDate[0]
}

// SET ALL INFO
const setInfo = (data) => {
    // CURRENT WEATHER
    timeZone.textContent = `Time Zone: ${data.timezone}`
    currentTemp.textContent = `${Math.round(data.current.temp)}º`
    feelsLike.textContent = `Feels Like: ${Math.round(data.current.feels_like)}º`
    conditions.textContent = data.current.weather[0].description
    currentIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    humid.textContent = `${data.current.humidity}%`
    cloud.textContent = `${data.current.clouds}%`

    // EMPTY ARRAYS
    let dayArr = [ ]
    let iconArr = [ ]
    let highArr = [ ]
    let lowArr = [ ]

    // 7 DAY FORECAST
    // CONVERT UNIX TO DAY
    for (let i = 1; i < data.daily.length; i++) {
        let unixDate = data.daily[i].dt
        let day = getWeekDay(unixDate)
        dayArr.push(day)

        let forecastIcon = data.daily[i].weather[0].icon
        iconArr.push(forecastIcon)

        let highTemp = data.daily[i].temp.max
        highArr.push(highTemp)

        let lowTemp = data.daily[i].temp.min
        lowArr.push(lowTemp)
    }

    // ADDING DAYS TO DOM
    const weekFunc = (() => {
        for (let i = 0; i < weekDays.length; i++) {
            for (let j = 0; j < dayArr.length; j++) {
                weekDays[i].textContent = dayArr[j]
                i++
            }
        }
    })()
    
    // ADDING TEMPERATURE ICONS TO DOM
    const iconFunc = (() => {
        for (let i = 0; i < dailyIcons.length; i++) {
            for (let j = 0; j < iconArr.length; j++) {
                dailyIcons[i].src = `http://openweathermap.org/img/wn/${iconArr[j]}@2x.png`
                i++
            }
        }    
    })()

    // ADDING HIGH TEMP
    const highFunc = (() => {
        for (let i = 0; i < dailyHighs.length; i++) {
            for (let j = 0; j < highArr.length; j++) {
                dailyHighs[i].textContent = `${Math.round(highArr[j])}º`
                i++
            }
        }
    })()

    // ADDING LOW TEMP
    const lowFunc = (() => {
        for (let i = 0; i < dailyLows.length; i++) {
            for (let j = 0; j < lowArr.length; j++) {
                dailyLows[i].textContent = `${Math.round(lowArr[j])}º`
                i++
            }
        }
    })()
}

// GETTING COORDINATES USING GOOGLE GECODING API
const results = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${inputBox.value}&key=AIzaSyBzSDLLeQsAGpXqev0uRxCrU8CdOSj3xWw`)
    .then( res => res.json() )
    .then( data => {
        let latitude = data.results[0].geometry.location.lat
        let longitude = data.results[0].geometry.location.lng
        city.textContent = data.results[0].address_components[2].long_name

        // IF FAHRENHEIT IS CHECKED, GET FAHRENHEIT DATA
        if (fahrenheitOpt.checked) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?appid=6098b5f5fc2a503bea069d939105071d&lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial`)
            .then( res => res.json() )
            .then( data => {
                setInfo(data)
            })
            .catch(err => {
                console.log('ERROR', err)
            })
        } else if (celsiusOpt.checked) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?appid=6098b5f5fc2a503bea069d939105071d&lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric`)
            .then( res => res.json() )
            .then( data => {
                setInfo(data)
            })
            .catch(err => {
                console.log('ERROR', err)
            }) 
        }
    })
    .catch(e => console.log('error!', e))
}
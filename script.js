const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItems = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const weatherDescription = document.getElementById('weather-desc');




const API_KEY = '4359c6a121e26333d717a104ac3707c6';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','Augast','September','October','November','December'];

setInterval(()=>{

        const time = new Date();
        const month = time.getMonth();
        const date = time.getDate();
        const day = time.getDay();
        const hour = time.getHours();
        let minutes = time.getMinutes();
        const hoursIn12HrFormat = hour >=13 ? hour%12 : hour;
        const appm = hour >= 12 ? 'PM' : 'AM';

        if(minutes<10){
            minutes = '0' + minutes;
        }

        timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes + ' ' + `<span id="am-pm">${appm}</span>`
        dateEl.innerHTML =days[day]  + ', '+date+' '+months[month];

    },1000);
    
    getWeatherData();

    function getWeatherData(){
        navigator.geolocation.getCurrentPosition((success)=>{


            let {latitude,longitude} = success.coords;
            console.log(`${longitude}`);


            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{


                
                console.log(data);
                showWeatherData(data);
            })
        })
    }

    function showWeatherData(data){
        let {humidity, pressure,sunrise,sunset,temp,uvi,wind_speed,clouds}= data.current;
        
        currentWeatherItems.innerHTML=`<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Cloud</div>
        <div>${clouds}</div>
    </div>
    <div class="weather-item">
        <div>Wind speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>UV</div>
        <div>${uvi}</div>
    </div>`;
        


    let otherDayForcast = '';
    data.daily.forEach((day,idx)=>{
        if(idx == 0){
            currentTempEl.innerHTML= `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp"><img src="crescent-moon.png" alt="moon" id="moon">  ${day.temp.night}&#176; C</div>
                <div class="temp"><img src="sun.png" alt="sun" id="sun">  ${day.temp.day}&#176; C</div>
            `;
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="">
            <div class="temp"><img src="crescent-moon.png" alt="moon" id="moon">  ${day.temp.night}&#176; C</div>
            <div class="temp"><img src="sun.png" alt="sun" id="sun"> ${day.temp.day}&#176; C</div>
            </div>
            `;
        }
    });

        weatherForecastEl.innerHTML=otherDayForcast;
    }

const KELWIN_DIFF = 273.15;
const METERS_TO_KILOMETER = 0.001;
const SECONDS_TO_HOUR = 1/3600;
const daysOfWeek = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

toggleBackground();

let apiAnswer;
let searchBar = document.getElementsByName("area")[0];
searchBar.addEventListener("keypress", (event)=> {
    const key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
      search(); // code for enter
    }
})
const search = ()=> {
    let city = searchBar.value;
    
    /*toggleButtonLoader(true, '<div class="loader"></div>', search);*/
    fetchWeather(city)
    .catch(error => 
        console.log("Błąd sieci lub serwera. \nFunkcja catch przechwyciła następujące logi błędów: ", error))
    .then(data => {
        const parsedData = parse(data);
        const dayBoxes = createDayBoxes(parsedData);
        renderDivlist(dayBoxes, "daylist");
        const hourBoxes = createHourBoxes(Object.values(parsedData)[0]);
        renderDivlist(hourBoxes, "hourlist");
        /*apiAnswer = data;
        console.log("data", data)
        const cityFromApi = data.query.results.channel.location.city;
        document.getElementsByClassName("city")[0].innerText = `Weather for: ${cityFromApi}`;*/
        /*renderWeatherContent(filterData(data));
        
        windButton.classList.remove('selected-tab');
        weatherButton.classList.add('selected-tab');*/
        /*toggleButtonLoader(false, '', search);*/
    })
    .catch(error => {
        /*toggleButtonLoader(false, '', search);*/
        console.log("Błąd danych.", error)
    });
}

const button = document.getElementsByClassName("searchButton")[0];
button.addEventListener("click", search);

//zapukać do api i połączyć się z nim za pomocą XHR i promisów. Ew async await
//zrobić listę danych: Miasto(nagłówek), niżej prognoza pogody na dziś, jutro, pojutrze w formacie `data-"rainy"`

const parse = (jsonObject) => {
    const parsed = jsonObject.list.reduce((currentSum, currentValue) =>{
        const date = currentValue.dt_txt.split(" ")[0];
            if(currentSum[date]) {
                currentSum[date].push(currentValue);
            } else (currentSum[date] = [currentValue])
        return currentSum;
    }, {})
    return parsed;
}
//2018-02-12 12.02
const createDayBoxes = (daysFromApi) => {
    const daylist = Object.entries(daysFromApi).map(([key, hours], index) => {
        const temperatures = hours.map(element => {
            return element.main.temp - KELWIN_DIFF;
        })
        
        const properIcon = getWeatherDayIcon(hours);
        
        const averageDayTemp = Math.round(temperatures.reduce((sum, currValue) => {
            return sum + currValue
        }, 0) / temperatures.length);

        const current = new Date(key);
        const dayName = daysOfWeek[current.getDay()];
        const dates = key.split("-");
        const dayAndMonth = dates[2].charAt(0) === '0' ? `${dates[2].charAt(1)}.${dates[1]}` : `${dates[2]}.${dates[1]}`;
        
        const divDay = document.createElement("div");
        divDay.innerHTML = `
        <span class="meteoicon" data-icon=${properIcon.weatherIcon}></span>
        <div class="date-and-temp">
            <span class="date">${dayName} ${dayAndMonth}</span>
            <span class="temp">${averageDayTemp} °C</span>
        </div>
        `;
        divDay.className = "day";
        divDay.addEventListener("click", handleDayClick.bind(null, hours, divDay))
        divDay.addEventListener("click", scrollBoxIntoView.bind(null, divDay))
        //divDay.name = el; el for ex. = 2018-04-25;
        /*Trzeba przypisać do onclicka funkcję! A nie ją wywołać(!!) jak tu: showHourlyTemp(el).. 
        Bind umożliwia przypisanie funkcji do zdarzenia z odpowiednim argumentem bez wywołania!!
        Przypisać funkcji w ten sposób: ... = showHourlyTemp; też nie można bo nie przekazujemy potrzebnego nam argumentu. Ewentualnie można przypisać do onclicka funkcję strzałkową: () => showHourlyTemp(el); która po wykonaniu onclicka się wykona wywołując naszą funkcję z odpowiednim argumentem.
        */
        if(index === 0) {
            selectDay(divDay);
            toggleBackground(properIcon.weatherCode)
        };
        
        return divDay;
    });
    return daylist;
}

const selectDay = (divDay) => {
    const currentlySelectedDay = document.getElementsByClassName("selected-tab")[0];
    if (currentlySelectedDay) {
        currentlySelectedDay.classList.remove('selected-tab');
    }
    divDay.classList.add('selected-tab');
}

const showHourlyTemp = (day) => {
    renderDivlist(createHourBoxes(day), "hourlist");
}

const handleDayClick = (day, divDay) => {
    selectDay(divDay);
    showHourlyTemp(day);
    toggleBackground(getWeatherDayIcon(day).weatherCode);
}

const createHourBoxes = (day) => {
    const hourAndTempList = day.map((el, index) => {
        const hours = el.dt_txt.split(" ")[1].split(":", 2);
        const temp = Math.round(el.main.temp - KELWIN_DIFF);
        const hourAndTemp = {hour: `${hours[0]}:${hours[1]}`, celsius: temp};

        const properIcon = getWeatherDayIcon([el]);
        
        const accordionHeadline = el.weather[0].description;
        const windSpeed = Math.round(el.wind.speed*(METERS_TO_KILOMETER/SECONDS_TO_HOUR));
        const pressure = Math.round(el.main.pressure);
        const divHourBox = document.createElement("div");
        divHourBox.innerHTML = `
            <label class="hour-tab" for="h-${index}">
                <span class="hour">${hourAndTemp.hour}</span>
                <span class="meteoicon" data-icon=${properIcon.weatherIcon}></span>
                <span class="hour-temp">${hourAndTemp.celsius} °C</span>
            </label>
            <div class="in-hour-tab-accordion">
                <span class="accordion-head">${accordionHeadline}</span>
                <div class="accordion-pressure">
                    <div class="accordion-tag">
                        <span class="accordion-label">Pressure </span>
                        <span class="accordion-data">${pressure} hPa</span>
                    </div>
                </div>
                <div class="accordion-humidity">
                    <div class="accordion-tag">
                        <span class="accordion-label">Humidity </span>
                        <span class="accordion-data">${el.main.humidity } %</span>
                    </div>
                </div>
                <div class="accordion-wind-speed">
                    <div class="accordion-tag">
                        <span class="accordion-label">Wind speed </span>
                        <span class="accordion-data">${windSpeed} km/h</span>
                    </div>
                </div>				
            </div>
        `;
        divHourBox.addEventListener("click", scrollBoxIntoView.bind(null, divHourBox));
        
        divHourBox.tabIndex = "1";
        divHourBox.className = "hour-box";
        return divHourBox;
    })
    return hourAndTempList;
}

const scrollBoxIntoView = (boxElement) => {
    setTimeout(() => {
        boxElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
    }, 260);
};

const renderDivlist = (htmlElements, nameOfList) => {
    const divList = document.createElement("div");
    htmlElements.forEach((element) =>{
       divList.appendChild(element);
    });
    divList.className = nameOfList;
    
    const list = document.getElementsByClassName(nameOfList)[0];
    list.parentNode.replaceChild(divList, list);
}

let fetchWeather = (city)=>{
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=26c42f8b8305b74545f93ce538ad2356`;
    return fetch(requestUrl, {
        method: 'get'
    }).then((response)=> {
        return response.json(); //fetch zwraca obiekt response, a potem w wykonujemy funkcję json zawartą w prototypie tego response, żeby dostać potrzebne dane. json() tylko je wyciąga, a ich konkwersja dzieje się pod spodem
    }).catch(error => {
        console.error("error", error);
        return error;
    })
    
    /* Zamiast zwykłego XHR, stosuje się funkcję fetch, która domyślnie zwraca Promise, a wszystkie funkcje z promisa starego robi pod spodem:)
    return new Promise((resolve, reject)=>
    {
        let req = new XMLHttpRequest();
        req.open('GET', `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}")&format=json&env=store://datatables.org/alltableswithkeys`)
                //select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="nome, ak") format=json)
        req.onload = ()=> resolve(req.responseText)
        req.onerror = ()=> reject("Dane nie przyszły")
        req.ontimeout = () => reject("timeout");
        req.onabort = () => reject("abort");
        req.send(null);
    })*/
}



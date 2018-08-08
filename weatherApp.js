const KELWIN_DIFF = 273.15;
const METERS_TO_KILOMETER = 0.001;
const SECONDS_TO_HOUR = 1/3600;

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

/*
let filterData = (dataFromApi)=> {
    const forecasts = dataFromApi.query.results.channel.item.forecast;
    const weatherRows = forecasts.slice(0,3).map((currValue) => { 
        return {
            date: currValue.date,
            value: currValue.text
        }
    });
    console.log("weatherRows", weatherRows);
    return weatherRows;
}*/

/*let createWeatherItem = (weatherItem, name)=> {
    const divData= document.createElement("div");
    divData.innerHTML = `${weatherItem.date}- `;
    divData.className = 'date';

    const divWeather = document.createElement("div");
    divWeather.innerHTML = weatherItem.value;
    divWeather.className = name;

    const divItem = document.createElement("div");
    divItem.appendChild(divData);
    divItem.appendChild(divWeather);
    divItem.innerHTML = `
        <div class="date">${weatherItem.date}- </div>
        <div class="${name}">${weatherItem.value}</div>
    `
    divItem.className = 'item';
    console.log("divItem",divItem);
    return divItem;
}*/

/*
const renderItem = (array)=> {
	console.log("array", array)
    const containerDiv = document.createElement("div");
       array.forEach((element) =>{
           containerDiv.appendChild(element);
       });
    containerDiv.className = 'container';
    const container = document.getElementsByClassName("container")[0];
    container.parentNode.replaceChild(containerDiv, container);
}

const renderWeatherContent = (filteredData)=> {
    const cityWeatherDivs = filteredData.map((element)=> {
        return createWeatherItem(element, 'weather');
    });
    console.log("cityWeatherDivs", cityWeatherDivs);
    renderItem(cityWeatherDivs);
}

const renderWindContent = ()=> {
    weatherButton.classList.remove("selected-tab");
    windButton.classList.add("selected-tab");
    const date = apiAnswer.query.results.channel.item.forecast[0].date
    const speed = apiAnswer.query.results.channel.wind.speed;

    const divItem = createWeatherItem({date: date, value: `speed: ${speed}`}, 'speed');
    
    console.log("divItem", divItem);
    renderItem([divItem]);
}*/

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
		const dates = key.split("-");
		const dayAndMonth = `${dates[2]}.${dates[1]}`;
		const divDay = document.createElement("div");
		divDay.innerHTML = `
			<span class="meteoicon" data-icon=${properIcon.weatherIcon}></span>
			<div class="date-and-temp">
				<span class="date">${dayAndMonth}</span>
				<span class="temp">${averageDayTemp} °C</span>
			</div>
		`;
		divDay.className = "day";
		divDay.onclick = handleDayClick.bind(null, hours, divDay);
		//divDay.name = el; el for ex. = 2018-04-25;
		/*Trzeba przypisać do onclicka funkcję! A nie ją wywołać(!!) jak tu: showHourlyTemp(el).. 
		Bind umożliwia przypisanie funkcji do zdarzenia z odpowiednim argumentem bez wywołania!!
		Przypisać funkcji w ten sposób: ... = showHourlyTemp; też nie można bo nie przekazujemy potrzebnego nam argumentu. Ewentualnie można przypisać do onclicka funkcję strzałkową: () => showHourlyTemp(el); która po wykonaniu onclicka się wykona wywołując naszą funkcję z odpowiednim argumentem.
		*/
		if(index === 0) {
			selectDay(divDay);
			setBackground(properIcon.weatherCode)
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
	setBackground(getWeatherDayIcon(day).weatherCode)
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
		/*createAccordionContent(day, divHourBox);*/
		divHourBox.tabIndex = "1";
		divHourBox.className = "hour-box";
		return divHourBox;
	})
	return hourAndTempList;
}

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
		/*console.log("mockedData", mockedData);
		const parsed = parse(mockedData);
		return parsed;*/
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



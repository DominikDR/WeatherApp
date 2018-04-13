let apiAnswer;
const onButtonClick = (event)=> {
    let city = document.getElementsByName("area")[0].value
    fetchWeather(city).then(data => {
        apiAnswer = data;
        console.log(data, "data")
        const cityFromApi = data.query.results.channel.location.city;
        document.getElementsByClassName("city")[0].innerText = `Pogoda dla miasta: ${cityFromApi}`;
        renderWeatherContent(filterData(data));
        
        windTitle.classList.remove('selected-tab');
        weatherTitle.classList.add("selected-tab");
    });
}

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
}

let createWeatherItem = (weatherItem, name)=> {
    /*const divData= document.createElement("div");
    divData.innerHTML = `${weatherItem.date}- `;
    divData.className = 'date';

    const divWeather = document.createElement("div");
    divWeather.innerHTML = weatherItem.value;
    divWeather.className = name;
*/
    const divItem = document.createElement("div");
    /*divItem.appendChild(divData);
    divItem.appendChild(divWeather);*/
    divItem.innerHTML = `
        <div class="date">${weatherItem.date}- </div>
        <div class="${name}">${weatherItem.value}</div>
    `
    divItem.className = 'item';
    console.log("divItem",divItem);
    return divItem;
}

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
    weatherTitle.classList.remove("selected-tab");
    windTitle.classList.add("selected-tab");
    const date = apiAnswer.query.results.channel.item.forecast[0].date
    const speed = apiAnswer.query.results.channel.wind.speed;

    const divItem = createWeatherItem({date: date, value: `speed: ${speed}`}, 'speed');
    
    console.log("divItem", divItem);
    renderItem([divItem]);
}

const button = document.getElementsByName("submit")[0];
button.addEventListener("click", onButtonClick);

const weatherTitle = document.getElementsByClassName("weatherTitle")[0];
const windTitle = document.getElementsByClassName("windTitle")[0];

weatherTitle.addEventListener("click", ()=>{
    windTitle.classList.remove("selected-tab");
    weatherTitle.classList.add("selected-tab");
    renderWeatherContent(filterData(apiAnswer));
})
windTitle.addEventListener("click", renderWindContent);

//zapukać do api i połączyć się z nim za pomocą XHR i promisów. Ew async await
//zrobić listę danych: Miasto(nagłówek), niżej prognoza pogody na dziś, jutro, pojutrze w formacie `data-"rainy"`
let fetchWeather = (city)=>{
    const requestUrl = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}")&format=json&env=store://datatables.org/alltableswithkeys`;
    return fetch(requestUrl, {
        method: 'get'
    }).then((response)=> {
        console.log("data", response);
        return response.json(); //fetch zwraca obiekt response, a potem w wykonujemy funkcję json zawartą w prototypie tego response, żeby dostać potrzebne dane. json() tylko je wyciąga, a ich konkwersja dzieje się pod spodem
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

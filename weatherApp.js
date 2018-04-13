const onButtonClick = (event)=> {
   let city = document.getElementsByName("area")[0].value;
   fetchWeather(city).then(data => {
       const cityFromApi = data.query.results.channel.location.city;
       document.getElementsByClassName("city")[0].innerText = `Pogoda dla miasta: ${cityFromApi}`;
       renderWeatherItem(filterData(data));
   });
}

let filterData = (dataFromApi)=> {
    const forecasts = dataFromApi.query.results.channel.item.forecast;
    const weatherRows = forecasts.slice(0,3).map((currValue) => { 
        return {
            date: currValue.date,
            weather: currValue.text
        }
    });
    return weatherRows;
}

let createWeatherItem = (weatherItem)=> {
    const divData= document.createElement("div");
    divData.innerHTML = `${weatherItem.date}- `;
    divData.className = 'date';

    const divWeather = document.createElement("div");
    divWeather.innerHTML = weatherItem.weather;
    divWeather.className = 'weather';

    const divItem = document.createElement("div");
    divItem.appendChild(divData);
    divItem.appendChild(divWeather);
    divItem.className = 'item';
    return divItem;
}

let renderWeatherItem = (filteredData)=> {
    
    const cityWeatherDivs = filteredData.map(createWeatherItem);
    const containerDiv = document.createElement("div");
       cityWeatherDivs.forEach((element) =>{
           containerDiv.appendChild(element);
       });
    containerDiv.className = 'container';
    const container = document.getElementsByClassName("container")[0];
    container.parentNode.replaceChild(containerDiv, container);
}

const button = document.getElementsByName("submit")[0];
button.addEventListener("click", onButtonClick);


//zapukać do api i połączyć się z nim za pomocą XHR i promisów. Ew async await
//zrobić listę danych: Miasto(nagłówek), niżej prognoza pogody na dziś, jutro, pojutrze w formacie `data-"rainy"`
let fetchWeather = (city)=> {
    const requestUrl = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}")&format=json&env=store://datatables.org/alltableswithkeys`;
    return fetch(requestUrl, {
        method: 'get'
    }).then((response)=> {
            console.log('response',response)
            return response.json() //fetch zwraca obiekt response, a potem w wykonujemy funkcję json zawartą w prototypie tego response, żeby dostać potrzebne dane. json() tylko je wyciąga, a ich konkwersja dzieje się pod spodem
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


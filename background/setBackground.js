const background = document.getElementsByClassName("background")[0];

const toggleBackground = (weatherCode) => {
    if (weatherCode) {
        setWeatherBackground(weatherCode);
    } else {
        setInitialBackground();
    }
}

const setWeatherBackground = (weatherCode) => {
    const initialBackground = document.getElementById('initial-background');
    if (initialBackground) {
        document.body.removeChild(initialBackground);
    }
    background.classList.remove('hide-content');
    background.style.backgroundImage = `url(${backgroundsMapping[weatherCode]})`;
}

const setInitialBackground = () => {
    const newObject = document.createElement("object");
    const finalObject = Object.assign(newObject, {
        id: "world-map-background",
        type:"image/svg+xml",
        data: "./assets/Initial_background/worldMap.svg",
        alt: "SVG world map.",
    });
    
    const divContainer = document.getElementById("initial-background");
    divContainer.innerHTML = `
        <div id="headline">
            <span>Check the weather around the World.</span>
        </div>
    `;
    divContainer.appendChild(finalObject);
    
    background.classList.add('hide-content');
}

let log = console.log.bind(console);
const parseHour = (hour) => {
	const splittedHour = hour.dt_txt.split(" ")[1].split(":")[0];
	return parseInt(splittedHour, 10);
}

const getMainHours = (hours) => {
	const mainHours = hours.filter((element) => {
		if(6 <= parseHour(element) && parseHour(element) <= 21) {
			return true;
		}
	});
	return mainHours;
}

const getWeatherDayIcon = (hours) => { //bedzie zwracac ikonke dla danego dnia
	let mainHours = getMainHours(hours);
	if(mainHours.length === 0) {
		mainHours = hours;
	};
	
	
	
	const isStorm = checkIfHoursHaveWeather(mainHours, 2)
	if(isStorm) return 'Pieruny';
	
	const isSnow = checkIfHoursHaveWeather(mainHours, 6)
	if(isSnow) return 'Śnieżek';
	
	const isRainy = checkIfHoursHaveWeather(mainHours, 8)
	if(isRainy) return 'Deszcz';
	
	const isDrizzle = checkIfHoursHaveWeather(mainHours, 3)
	if(isDrizzle) return 'Deszczyk';
	
	const groupWeatherCodes = mainHours.reduce((currentSum, currentValue) => {
		const weatherCode = currentValue.weather[0].id;
		if(currentSum[weatherCode]) {
			++currentSum[weatherCode];	
		} else {
			currentSum[weatherCode] = 1
		};
		return currentSum;
	},{})
	log("groupWeatherCodes", groupWeatherCodes)
};

const checkIfHoursHaveWeather = (hours, weatherCode) => {
	return (
		hours.find((hour) => 
		`${hour.weather[0].id}`.startsWith(weatherCode)
		)
	)? true : false;
}


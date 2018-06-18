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
const groupWeatherCodes = (mainHours)=> {
	const groupedCodes = mainHours.reduce((currentSum, currentValue) => {
		const weatherCode = currentValue.weather[0].id;
		if(currentSum[weatherCode]) {
			++currentSum[weatherCode];
		} else {
			currentSum[weatherCode] = 1;
		}
		return currentSum;
	},{});
	return groupedCodes;
}

const mostFrequentCode = (groupedWeatherCodes) => {
	console.log("groupedWeatherCodes", groupedWeatherCodes)
	console.log("objectentries", Object.entries(groupedWeatherCodes))
	const mostFrequent = Object.entries(groupedWeatherCodes)
		.reduce((previousVal, currVal) => (
			previousVal[1] > currVal[1] ? previousVal : currVal
		));
	return mostFrequent[0];
}

const getWeatherDayIcon = (hours) => {
	let mainHours = getMainHours(hours);
	
	if(mainHours.length === 0) {
		mainHours = hours;
		return iconCode.night[mostFrequentCode(groupWeatherCodes(mainHours))]
	};
	
	
	const isStorm = checkIfHoursHaveWeather(mainHours, 2)
	if(isStorm) return iconCode.day[200];
	
	const isSnow = checkIfHoursHaveWeather(mainHours, 6)
	if(isSnow) return iconCode.day[600];
	
	const isRainy = checkIfHoursHaveWeather(mainHours, 5)
	if(isRainy) return iconCode.day[500];
	
	const isDrizzle = checkIfHoursHaveWeather(mainHours, 3)
	if(isDrizzle) return iconCode.day[300];
	
	
	log("groupWeatherCodes", groupWeatherCodes(mainHours))
	log("mostFrequentCode", mostFrequentCode(groupWeatherCodes(mainHours)))
	
	return iconCode.day[mostFrequentCode(groupWeatherCodes(mainHours))];
}

const checkIfHoursHaveWeather = (hours, weatherCode) => {
	return (
		hours.find((hour) => 
			`${hour.weather[0].id}`.startsWith(weatherCode)
		)
	)? true : false;
}
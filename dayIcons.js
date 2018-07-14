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
	const mostFrequent = Object.entries(groupedWeatherCodes)
		.reduce((previousVal, currVal) => (
			previousVal[1] > currVal[1] ? previousVal : currVal
		));
	return mostFrequent[0];
}

const getWeatherDayIcon = (hours) => {
	let mainHours = getMainHours(hours);
	let dayOrNightIcon = mainHours.length === 0 ? iconCode.night : iconCode.day;
	
	if(mainHours.length === 0) {
		mainHours = hours;
	};
	
	const isStorm = checkIfHoursHaveWeather(mainHours, 2)
	if(isStorm) return {
		weatherCode: 200,
		weatherIcon: dayOrNightIcon[200]
	};
	
	const isSnow = checkIfHoursHaveWeather(mainHours, 6)
	if(isSnow) return {
		weatherCode: 600, 
		weatherIcon: dayOrNightIcon[600]
	};
	
	const isRainy = checkIfHoursHaveWeather(mainHours, 5)
	if(isRainy) return {
		weatherCode: 500,
		weatherIcon: dayOrNightIcon[500]
	};
	
	const isDrizzle = checkIfHoursHaveWeather(mainHours, 3)
	if(isDrizzle) return {
		weatherCode: 300,
		weatherIcon: dayOrNightIcon[300]
	};
	
	const weatherCode = mostFrequentCode(groupWeatherCodes(mainHours));
	const weatherIcon= dayOrNightIcon[weatherCode];
	
	return { weatherCode, weatherIcon };
}

const checkIfHoursHaveWeather = (hours, weatherCode) => {
	return (
		hours.find((hour) => 
			`${hour.weather[0].id}`.startsWith(weatherCode)
		)
	)? true : false;
}
const setBackground = (weatherCode) => {
	const background = document.getElementById("background");
	background.style.backgroundImage = `url(${backgroundsMapping[weatherCode]})`;
	background.style.backgroundColor = '#efefef';
}
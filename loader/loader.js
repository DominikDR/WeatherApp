const toggleButtonLoader = (bool, divLoader, search)=> {
	const searchButton = document.getElementsByClassName("searchButton")[0];
	const newButton = document.createElement("button");
	newButton.addEventListener("click", search);
	newButton.className = 'searchButton';
	newButton.disabled = bool;
	newButton.innerHTML = `Search${divLoader}`;
	searchButton.parentNode.replaceChild(newButton, searchButton);
}

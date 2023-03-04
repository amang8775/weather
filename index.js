let userTab = document.querySelector('[data-userWeather]');
let searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector(".weather-container");


const grantAccessContainer = document.querySelector(".grant-location-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");

const searchForm = document.querySelector("[data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");



let currTab = userTab;
currTab.classList.add('current-tab');
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
fetchFromSessionStorage() ; 

function switchTab(nextTab) {
    if (nextTab != currTab) {
        currTab.classList.remove('current-tab');
        currTab = nextTab;
        currTab.classList.add('current-tab');
        if (nextTab == userTab) {
            searchForm.classList.remove('active');
            userInfoContainer.classList.add('active');
            fetchFromSessionStorage() ; 
        }
        else {
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active') ; 
            searchForm.classList.add('active');
            
        }
    }
}


function fetchFromSessionStorage(){
    let coordinates = sessionStorage.getItem("user-coordinates") ; 
    if(!coordinates){
        grantAccessContainer.classList.add('active') ; 
    }
    else{
        grantAccessContainer.classList.remove('active') ; 
        coordinates = JSON.parse(coordinates) ; 
        fetchWeatherByUser(coordinates) ; 
    }
}
async function fetchWeatherByCity(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);

    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("Error Message", error.message);
    }
}
async function fetchWeatherByUser(userCoordinates) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");

    const { lat, lon } = userCoordinates;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("Error message", error.message);
    }
}
function renderWeather(data) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp}°C`;
    windspeed.innerText = data?.wind?.speed;
    humidity.innerText = data?.main?.humidity;
    cloudiness.innerText = data?.clouds?.all;

}

function getUserLocation() {
    if (navigator.geolocation) {
        grantAccessContainer.classList.remove('active') ; 
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Please allow location permisson");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherByUser(userCoordinates);
}
grantAccessButton.addEventListener("click", getUserLocation); 
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;

    if (city === "") return;
    else fetchWeatherByCity(city);
})


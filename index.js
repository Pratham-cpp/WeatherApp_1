const API_KEY = 'd6432e57874508b91f76f5814059b7e4';
const yournav = document.querySelector(".yourw");
const searchnav = document.querySelector(".searchw")
const searchsec = document.querySelector(".searchsection")
const searchbox = document.querySelector(".searchbox")
const searchbtn = document.querySelector(".searchicon")
const weathersec = document.querySelector(".weathersec")
const city = document.querySelector(".city")
const weathertext = document.querySelector(".weathertxt")
const temp = document.querySelector(".temp")
const windspeed = document.querySelector(".windspeed")
const humidity = document.querySelector(".humidity")
const clouds = document.querySelector(".clouds")
const weathericon = document.querySelector(".weathericon")
const flgimg = document.querySelector(".flgimage")
const grantlocsec = document.querySelector(".grantlocsec")
const grantbtn = document.querySelector(".grantbtn")
const errorimg = document.querySelector(".error404")
const loadingcont = document.querySelector(".loadingcontainer")

console.log("js ready")
var long = null;
var lat = null;
let locgranted = false
yournav.removeEventListener("click", onclick)
searchnav.removeEventListener("click", onclick)
// getCurrentCoor();
let currenTab = yournav;
currenTab.classList.add("currenttab");
function capfirstletter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
// showWeatherByCoor();
async function showWeatherByCoor() {
    loadingcont.classList.remove("hide")
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`)
        const data = await response.json();
        console.log("weather data -> ", data)
        city.textContent = data?.name
        temp.textContent = `${(data?.main?.temp.toFixed(2) - 273.15).toFixed(2)} ℃`
        windspeed.textContent = `${data?.wind?.speed}m/s`;
        humidity.textContent = `${data?.main?.humidity}%`;
        weathertext.textContent = capfirstletter(data?.weather?.[0]?.description);
        clouds.textContent = `${data?.clouds?.all}%`
        weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        flgimg.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
        loadingcont.classList.add("hide")
        weathersec.classList.add("active")
    }
    catch{
        console.log("location cannot be found")
    }
}
async function showWeatherByCity(City) {
    loadingcont.classList.remove("hide")
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${API_KEY}`);
        if(!response.ok){
            if(response.status == "404"){
                console.log("City not Found")
                throw new Error("There seems to be some mistake in spelling")
            }
        }
        const data = await response.json();
        console.log("weather data -> ", data)
        city.textContent = data?.name
        temp.textContent = `${(data?.main?.temp.toFixed(2) - 273.15).toFixed(2)} ℃`
        windspeed.textContent = `${data?.wind?.speed}m/s`;
        humidity.textContent = `${data?.main?.humidity}%`;
        weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        weathertext.textContent = data?.weather?.[0]?.description;
        clouds.textContent = `${data?.clouds?.all}%`
        flgimg.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
        loadingcont.classList.add("hide")
        if(response.ok){
            errorimg.classList.add("hide")
            weathersec.classList.add("active")
        }
    }
    catch(error){
        weathersec.classList.remove("active")
        loadingcont.classList.add("hide")
        console.error("Error in finding city")
        errorimg.classList.remove("hide")
    }
}

async function getCurrentCoor() {
    const getPosition = () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

    try {
        const position = await getPosition();
        long = position.coords.longitude;
        lat = position.coords.latitude;
        locgranted = true;
        console.log(long)
        console.log(lat)
        grantlocsec.classList.add("hide");
        showWeatherByCoor();
    } catch (error) {
        console.error("Error retrieving location:", error.message);
    }
}

function switchtab(clickedtab) {
    if (clickedtab != currenTab) {
        currenTab.classList.remove("currenttab")
        clickedtab.classList.add("currenttab")
        currenTab = clickedtab
    }
    if (currenTab == searchnav) {
        searchsec.classList.add("active")
        weathersec.classList.remove("active")
    }
    else {
        searchsec.classList.remove("active");
        errorimg.classList.add("hide")
        if (locgranted) {
            weathersec.classList.add("active")
        }
        weathersec.classList.remove("active")
    }
}


yournav.addEventListener('click', async (e) => {
    switchtab(yournav);
    if ((grantlocsec.classList.contains("hide")) && (locgranted)) {
        await getCurrentCoor();
        showWeatherByCoor();
    }
    else {
        grantlocsec.classList.remove("hide")
    }
})
searchnav.addEventListener('click', (e) => {
    switchtab(searchnav);
    grantlocsec.classList.add("hide")

})

searchbox.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        let searchtext = searchbox.value
        showWeatherByCity(searchtext)
    }
})

searchbtn.addEventListener('click', (e) => {
    let searchtext = searchbox.value
    showWeatherByCity(searchtext)
})
grantbtn.addEventListener("click", () => {
    getCurrentCoor();
    switchtab(yournav);
})

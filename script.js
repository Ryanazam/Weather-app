
const userTab =document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[ data-searchWeather]");
const userContainer =document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-info-container");
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");


let currentTab = userTab;
const API_KEY ="31235ba6d2f1bfb1a6829db700aa244c";

getfromSessionStorage();

currentTab.classList.add("current-tab");

 
function switchTab(clickedTab){

    if(currentTab != clickedTab){

        currentTab.classList.remove("current-tab");

        currentTab =clickedTab;

        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
           
        }
        else{

            // main pehle search wala tab pe tha  ab mujhe your weather wala tab pe ana hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            
                //  ab main your weather tab me aagya hoon toh weather bhi display krna hoga.
                // so lets check local storage first 
                // for coordinates ,if  we haved saved them there.

                    getfromSessionStorage();


        }

       


    }
}




userTab.addEventListener("click",()=>{

    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{

    switchTab(searchTab);
});

//  checked if coodinates are already presnt in session storage 

 function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){

        // agar nhi mile 

        grantAccessContainer.classList.add("active");

    }
    else{
             
        const  coordinates= JSON.parse(localCoordinates );
        fetchUserWeatherInfo(coordinates);

           
        
    }
 }

  async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} =coordinates;
    // make grant containre invicible 

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // NotFound.classList.remove("active");

    // apicall 

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
         const data =  await response.json();

         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");
         
         renderWeatherInfo(data);



    }
    catch(err){

        

    }

 }

function  renderWeatherInfo(weatherInfo){
//   firstly, we have to fetch the  elements 

     
const cityName= document.querySelector("[data-cityName]")
const countryIcon =document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]")
const weatherIcon= document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed =document.querySelector("[data-windspeed]");
const humidity =document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");


// fetch value from weatherInfo object and put it on UI elemnts 
 

cityName.innerText  = weatherInfo?.name;
countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innetText= weatherInfo?.weather?.[0]?.description;
weatherIcon.src= `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText= `${weatherInfo?.main?.temp}°C`;
windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
humidity.innerText = `${weatherInfo?.main?.humidity}%`;
cloudiness.innerText= `${weatherInfo?.clouds?.all}%`;



}      


function getlocation()
{
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }

    else{
           alert("NO geoloaction support is available");
    }

}

function showPosition(position){


    const userCoordinates ={

        lat:position.coords.latitude,

        lon:position.coords.longitude ,   }

        sessionStorage.setItem("user-coordinates" ,JSON.stringify(userCoordinates));

        fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton =document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getlocation);



//  search input fecting locaion weather 

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit" ,(e)=>{

    e.preventDefault();

    let cityName= searchInput.value;

    if(cityName=== "")
    {

        return; 
    }

    else{


    fetchSearchWeatherInfo(cityName);
    }




});

 async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active");
    

 
    try{    
               



        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    
   
        const data =  await response.json();

        if(!data.sys){

            throw data;
        }

        loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
     
 
        renderWeatherInfo(data);
         }

    
catch(error){
    loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = `${error?.message}`;
    apiErrorBtn.style.display = "none";
    }
}

 



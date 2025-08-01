import {defineStore} from "pinia";
import {ref} from "vue";

export const useWeatherStore = defineStore('weather', () =>{
    const currentWeather = ref(null);

    function setCurrentWeather(weather) {
        currentWeather.value = weather;
    }
    
    return {
        currentWeather,
        setCurrentWeather
    }
})
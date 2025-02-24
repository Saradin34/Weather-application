import { useState } from "react";
import axios from "axios";

interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
}

interface ForecastData {
    date: string;
    temperature: number;
    icon: string;
}

const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (city: string) => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

            // Текущая погода
            const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`
            );

            const weatherData = weatherResponse.data;
            setWeather({
                city: weatherData.name,
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                pressure: weatherData.main.pressure,
            });

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`
            );

            const groupedForecast: { [key: string]: any } = {};

            forecastResponse.data.list.forEach((item: any) => {
                const date = item.dt_txt.split(" ")[0];
                if (!groupedForecast[date]) {
                    groupedForecast[date] = item;
                }
            });

            const forecastData = Object.keys(groupedForecast)
                .slice(0, 5)
                .map((date) => ({
                    date,
                    temperature: groupedForecast[date].main.temp,
                    icon: groupedForecast[date].weather[0].icon,
                }));

            setForecast(forecastData);

            setHourlyForecast(
                forecastResponse.data.list.map((item: any) => ({
                    date: item.dt_txt,
                    temperature: item.main.temp,
                    icon: item.weather[0].icon,
                }))
            );
        } catch (err) {
            setError("Город не найден. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    return { weather, forecast, hourlyForecast, loading, error, fetchWeather };
};

export default useWeather;
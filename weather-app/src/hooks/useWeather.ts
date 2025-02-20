import { useState } from "react";
import axios from "axios";

interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    icon: string;
}

const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (city: string) => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            const data = response.data;
            setWeather({
                city: data.name,
                temperature: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
            });
        } catch (err) {
            setError("Город не найден. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    return { weather, loading, error, fetchWeather };
};

export default useWeather;
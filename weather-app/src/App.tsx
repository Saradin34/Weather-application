import { useEffect, useState } from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar.tsx";
import WeatherCard from "./components/WatherCard.tsx";
import Forecast from "./components/Forecast.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import styles from "./App.module.scss";

const App = () => {
    const [city, setCity] = useState("");
    const { weather, forecast, hourlyForecast, loading, error, fetchWeather } = useWeather();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    console.error("Ошибка геолокации:", error);
                    setError("Геолокация недоступна. Введите город вручную.");
                }
            );
        } else {
            setError("Ваш браузер не поддерживает геолокацию. Введите город вручную.");
        }
    }, []);

    const fetchWeatherByCoords = async (lat: number, lon: number) => {
        const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`
        );
        setCity(response.data.name);
        fetchWeather(response.data.name);
    };

    const handleSearch = (city: string) => {
        setCity(city);
        fetchWeather(city);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Приложение погоды</h1>
            <SearchBar onSearch={handleSearch} />
            {loading && <p className={styles.loading}>Загрузка...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <ErrorBoundary>
                {weather && <WeatherCard {...weather} />}
            </ErrorBoundary>

            <ErrorBoundary>
                {forecast.length > 0 && <Forecast forecast={forecast} hourlyForecast={hourlyForecast} />}
            </ErrorBoundary>
        </div>
    );
};

export default App;
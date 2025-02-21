import { useState } from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WatherCard";
import styles from "./App.module.scss";

const App = () => {
    const [city, setCity] = useState("");
    const { weather, loading, error, fetchWeather } = useWeather();

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
            {weather && <WeatherCard {...weather} />}
        </div>
    );
};

export default App;
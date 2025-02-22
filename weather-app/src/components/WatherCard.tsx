import { motion } from "framer-motion";
import styles from "./WeatherCard.module.scss";

interface WeatherCardProps {
    city: string;
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
}

const WeatherCard = ({
                         city,
                         temperature,
                         description,
                         icon,
                         humidity,
                         windSpeed,
                         pressure,
                     }: WeatherCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.card}
        >
            <h2 className={styles.city}>{city}</h2>
            <img
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className={styles.icon}
            />
            <p className={styles.temperature}>{Math.round(temperature)}°C</p>
            <p className={styles.description}>{description}</p>
            <div className={styles.details}>
                <p>Влажность: {humidity}%</p>
                <p>Ветер: {windSpeed} м/с</p>
                <p>Давление: {pressure} гПа</p>
            </div>
        </motion.div>
    );
};

export default WeatherCard;
import { motion } from "framer-motion";
import styles from "./WeatherCard.module.scss";
import { translateWeather } from ".././utils/translateWeather.ts";

interface WeatherCardProps {
    city: string;
    temperature: number;
    description: string;
    icon: string;
}

const WeatherCard = ({ city, temperature, description, icon }: WeatherCardProps) => {
    const translatedDescription = translateWeather(description);

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
            <p className={styles.description}>{translatedDescription}</p>
        </motion.div>
    );
};

export default WeatherCard;
import { motion } from "framer-motion";

interface WeatherCardProps {
    city: string;
    temperature: number;
    description: string;
    icon: string;
}

const WeatherCard = ({ city, temperature, description, icon }: WeatherCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
            <h2 className="text-2xl font-bold">{city}</h2>
            <img
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="mx-auto my-4"
            />
            <p className="text-xl">{Math.round(temperature)}°C</p>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
};

export default WeatherCard;
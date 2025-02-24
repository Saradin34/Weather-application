import { useState, useRef, useEffect } from "react";
import styles from "./Forecast.module.scss";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ForecastProps {
    forecast: {
        date: string;
        temperature: number;
        icon: string;
    }[];
    hourlyForecast?: {
        date: string;
        temperature: number;
        icon: string;
    }[];
}

const Forecast = ({ forecast, hourlyForecast = [] }: ForecastProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chartRef = useRef<any>(null);

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    const filteredHourlyForecast = selectedDate
        ? hourlyForecast.filter((item) => item.date.startsWith(selectedDate))
        : [];

    const chartData = {
        labels: filteredHourlyForecast.map((item) => item.date.split(" ")[1]),
        datasets: [
            {
                label: "Температура (°C)",
                data: filteredHourlyForecast.map((item) => item.temperature),
                borderColor: "rgba(99, 102, 241, 1)",
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
                    gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: "rgba(99, 102, 241, 1)",
                pointBorderColor: "#fff",
                pointHoverRadius: 7,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 14 },
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (context: any) => `Время: ${context[0].label}`,
                    label: (context: any) => `Температура: ${context.raw}°C`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#ccc",
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                    color: "#ccc",
                    font: {
                        size: 12,
                    },
                    callback: (value: any) => `${value}°C`,
                },
            },
        },
        animation: {
            duration: 1000,
            easing: "easeInOutQuart",
        },
    };

    return (
        <div className={styles.forecast}>
            <h3>Прогноз на 5 дней</h3>
            <div className={styles.items}>
                {forecast.map((item, index) => (
                    <div
                        key={index}
                        className={styles.item}
                        onClick={() => handleDayClick(item.date)}
                    >
                        <p>{new Date(item.date).toLocaleDateString("ru-RU")}</p>
                        <img
                            src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                            alt="Weather icon"
                        />
                        <p>{Math.round(item.temperature)}°C</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            &times;
                        </button>
                        <h4>Погода на {new Date(selectedDate!).toLocaleDateString("ru-RU")}</h4>
                        <div className={styles.chartContainer}>
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={3}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                },
                                480: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                            }}
                        >
                            {filteredHourlyForecast.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className={styles.hourlyItem}>
                                        <p>{item.date.split(" ")[1]}</p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                                            alt="Weather icon"
                                        />
                                        <p>{Math.round(item.temperature)}°C</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecast;
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

// Импортируем стили Swiper
import "swiper/css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Добавляем плагин для заливки под линией
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
        setIsModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
        setSelectedDate(null);
    };

    // Фильтруем почасовой прогноз для выбранной даты
    const filteredHourlyForecast = selectedDate
        ? hourlyForecast.filter((item) => item.date.startsWith(selectedDate))
        : [];

    // Данные для графика
    const chartData = {
        labels: filteredHourlyForecast.map((item) => item.date.split(" ")[1]), // Время
        datasets: [
            {
                label: "Температура (°C)",
                data: filteredHourlyForecast.map((item) => item.temperature),
                borderColor: "rgba(99, 102, 241, 1)", // Фиолетовый цвет линии
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
                    gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
                    return gradient;
                },
                fill: true, // Заливка под линией
                tension: 0.4, // Плавность линии
                pointRadius: 5, // Размер точек
                pointBackgroundColor: "rgba(99, 102, 241, 1)",
                pointBorderColor: "#fff",
                pointHoverRadius: 7, // Размер точек при наведении
            },
        ],
    };

    // Настройки для графика
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Отключаем фиксированное соотношение сторон
        plugins: {
            legend: {
                display: false, // Скрываем легенду
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
                    display: false, // Скрываем сетку по оси X
                },
                ticks: {
                    color: "#ccc", // Цвет текста на оси X
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.1)", // Цвет сетки по оси Y
                },
                ticks: {
                    color: "#ccc", // Цвет текста на оси Y
                    font: {
                        size: 12,
                    },
                    callback: (value: any) => `${value}°C`, // Добавляем °C к значениям на оси Y
                },
            },
        },
        animation: {
            duration: 1000, // Продолжительность анимации
            easing: "easeInOutQuart", // Тип анимации
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

            {/* Модальное окно */}
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

                        {/* Слайдер для почасового прогноза */}
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
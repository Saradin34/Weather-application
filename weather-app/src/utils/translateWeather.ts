export const translateWeather = (description: string): string => {
    const translations: { [key: string]: string } = {
        "clear sky": "ясно",
        "few clouds": "небольшая облачность",
        "scattered clouds": "рассеянные облака",
        "broken clouds": "облачно с прояснениями",
        "shower rain": "ливень",
        "rain": "дождь",
        "thunderstorm": "гроза",
        "snow": "снег",
        "mist": "туман",
    };

    return translations[description] || description;
};
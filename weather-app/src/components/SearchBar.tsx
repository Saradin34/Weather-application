import { useState } from "react";

interface SearchBarProps {
    onSearch: (city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [city, setCity] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(city);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введите город"
                className="p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            >
                Поиск
            </button>
        </form>
    );
};

export default SearchBar;
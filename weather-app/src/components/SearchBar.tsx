import { useState } from "react";
import styles from "./SearchBar.module.scss";

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
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введите город"
                className={styles.input}
            />
            <button type="submit" className={styles.button}>
                Поиск
            </button>
        </form>
    );
};

export default SearchBar;
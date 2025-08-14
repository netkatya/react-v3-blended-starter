
import css from './ThemeToggle.module.css';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}


export default function ThemeToggle({ isDark, onToggle }:ThemeToggleProps) {

    return (
        <>
            <label className={css.switch}>
                <input type="checkbox" checked={isDark} onChange={onToggle}/>
                <span className={css.slider}></span>
                <span className={css.clouds_stars}></span>
            </label>
        </>
    )
}
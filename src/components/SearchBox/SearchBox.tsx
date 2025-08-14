import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value?: string;
  onChange: (query: string) => void;
}

export default function SearchBox({ value="", onChange }: SearchBoxProps) {


  return <input className={css.input}
    type="text"
    placeholder="Search posts"
    value={value}
    onChange={(e) => onChange(e.target.value)} />;
}

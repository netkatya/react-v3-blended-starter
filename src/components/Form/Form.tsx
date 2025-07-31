import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import style from "./Form.module.css";

interface FormProps {
  onSubmit: (search: string) => void;
}

const Form = ({ onSubmit }: FormProps) => {
  
  const handleSubmit = (FormData: FormData) => {
    const search = (FormData.get("search") as string).trim();

    if (!search) {
      toast.error("Please enter your search query.");
      return;
    }
    onSubmit(search);
  }

  return (
    <form className={style.form} action={handleSubmit}>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        autoFocus
      />

      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>
    </form>
  );
}

export default Form;

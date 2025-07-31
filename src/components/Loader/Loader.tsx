import style from "./Loader.module.css";
import { GridLoader } from "react-spinners";

export default function Loader() {
  return <div className={style.backdrop}>{<GridLoader />}</div>;
}

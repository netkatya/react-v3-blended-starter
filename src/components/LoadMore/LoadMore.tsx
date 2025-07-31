import styles from './LoadMore.module.css';

interface LoadMoreProps {
    onClick: () => void;
}

export default function LoadMore({onClick}: LoadMoreProps) {
    return (
        <button className={styles.button} onClick={onClick}>
            Load More
        </button>
    )
}
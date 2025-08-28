import css from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <>
      <div className={css.container}>
        <h1 className={css.error}>404</h1>
        <p className={css.message}>Oooops! Page not found</p>
        <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
      </div>
    </>
  );
}

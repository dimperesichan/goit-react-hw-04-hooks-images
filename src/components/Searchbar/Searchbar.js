import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { infoOptions } from '../../helpers/toastyOptions';
import { toast } from 'react-toastify';
import styles from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleChange = event => {
    setQuery(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (query.trim() === '') {
      toast.info('Write something!', infoOptions);
      return;
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <header className={styles.Search}>
      <form className={styles.Search__form} onSubmit={handleSubmit}>
        <button className={styles.Search__button} type="submit">
          <span className={styles.Search__label}>Search</span>
        </button>

        <input
          name="form_input"
          value={query}
          onChange={handleChange}
          className={styles.Search__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="What did you want to find?"
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

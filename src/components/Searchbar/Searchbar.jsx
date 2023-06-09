import { useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineSearch } from 'react-icons/ai';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Header, Form, Input, Span, SubmitButton, Icon } from './Searchbar.styled.jsx';

export function Searchbar({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = e => {
    setInputValue(e.target.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      return Notify.warning('You didn`t enter anything in the search box. Please try again.');
    }

    const data = e.target.elements.searchQuery.value.trim();

    onSubmit(data);
    setInputValue('');
  };

  return (
    <Header>
      <Form onSubmit={handleSubmit}>
        <SubmitButton type="submit">
          <Icon>
            <AiOutlineSearch />
          </Icon>
          <Span>Search</Span>
        </SubmitButton>
        <Input
          type="text"
          name="searchQuery"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={inputValue}
          onChange={handleChange}
        />
      </Form>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

import { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Searchbar } from '../Searchbar/index.js';
import { ImageGallery } from '../ImageGallery/index.js';
import { Button } from '../Button/index.js';
import { LoaderComponent } from '../Loader/index.js';
import * as API from '../../api/index.js';
import { Message } from 'components/Message/index.js';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    async function fetchImages() {
      try {
        setIsLoading(true);

        const data = await API.getImages(searchQuery, currentPage);

        if (data.hits.length === 0) {
          return Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        const normalizedImages = API.normalizedImages(data.hits);
        setImages(images => [...images, ...normalizedImages]);
        setIsLoading(false);
        setError('');
        setTotalPages(Math.ceil(data.totalHits / 12));
      } catch (error) {
        Notify.failure('Oops, something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [currentPage, searchQuery]);

  const loadMore = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };

  const handleSubmit = query => {
    setSearchQuery(query);
    setImages([]);
    setCurrentPage(1);
    setError(null);
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      {images.length > 0 ? (
        <ImageGallery images={images} />
      ) : (
        <Message>{'Here begins the search for your pictures'}</Message>
      )}
      {isLoading && <LoaderComponent />}
      {images.length > 0 && totalPages !== currentPage && !isLoading && (
        <Button onClick={loadMore} />
      )}
    </>
  );
}

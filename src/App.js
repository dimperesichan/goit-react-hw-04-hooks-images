import React, { useState, useEffect, Fragment } from 'react';
import Searchbar from './components/Searchbar';
import Button from './components/Button';
import Gallery from './components/Gallery';
import LoaderSpinner from './components/Loader';
import Section from './components/Section';
import Modal from './components/Modal';
import API from './services/galleryApi';
import { errorOptions, infoOptions } from './helpers/toastyOptions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function App() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [fullImageURL, setFullImageURL] = useState('');
  const [altImageTitle, setAltImageTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!search) return;

    setIsLoading(true);

    API(search, currentPage)
      .then(images => {
        if (!images) {
          toast.error('No such results! Your Majesty', errorOptions);
          return;
        }

        if (images.length > 1) toast.info('Found! Your Majesty', infoOptions);

        setGallery(state => [...state, ...images]);
      })
      .catch(error => {
        toast.error(`No images by "${search}", Your Majesty`, errorOptions);
        console.log('error on catch: ', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, search]);

  const onLoadMoreButtonClick = () => {
    setCurrentPage(state => state + 1);

    const options = {
      top: null,
      behavior: 'smooth',
    };

    options.top = window.pageYOffset + document.documentElement.clientHeight;
    setTimeout(() => {
      window.scrollTo(options);
    }, 1000);
  };

  const handleSubmit = query => {
    if (query !== search) {
      setGallery([]);
      setSearch(query);
      setCurrentPage(1);
    }
  };

  const handleImageClick = event => {
    if (event.target.nodeName !== 'IMG') {
      return;
    }

    event.preventDefault();

    const fullImageLink = event.target.getAttribute('data-src');
    const altImageTitle = event.target.getAttribute('alt');

    setFullImageURL(fullImageLink);
    setAltImageTitle(altImageTitle);
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Fragment>
      <Searchbar onSubmit={handleSubmit} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable
        draggablePercent={60}
      />

      {isLoading && (
        <Section>
          <LoaderSpinner />
        </Section>
      )}

      {search && <Gallery gallery={gallery} onClick={handleImageClick} />}

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <img src={fullImageURL} alt={altImageTitle} />
        </Modal>
      )}

      <Section>
        {search && gallery.length > 11 && (
          <Button onClick={onLoadMoreButtonClick} />
        )}
      </Section>
    </Fragment>
  );
}

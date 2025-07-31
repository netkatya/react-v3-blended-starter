import Section from "../Section/Section";
import Container from "../Container/Container";
import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Loader from "../Loader/Loader";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import type { Photo } from "../../types/photo";
import { getPhotos } from "../../services/photos";
import LoadMore from "../LoadMore/LoadMore";

export default function App() {

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState("nature");
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    async function fetchPhotos() {
      try { 
        setIsLoading(true);
        setIsError(false);
        const fetchedPhotos = await getPhotos(searchQuery, page);

        if (page === 1) {
          setPhotos(fetchedPhotos);
        } else {
          setPhotos((prev) => [...prev, ...fetchedPhotos])
        }
        
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, [searchQuery, page])

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setPage(1);
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  }

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  }

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />

          {isLoading && <Loader />}
          {isError && <p>Error...</p>}

          {photos.length > 0 && (
            <PhotosGallery photos={photos} onPhotoClick={handlePhotoClick}/>
          )}
          {photos.length > 0 && !isLoading && (
            <LoadMore onClick={()=>setPage((prev)=>prev+1)}/>
          )}

          {selectedPhoto && (
            <Modal onClose={handleCloseModal}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </Modal>
          )}
        </Container>
      </Section>
    </>
  );
}

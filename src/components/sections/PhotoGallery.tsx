import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { galleryApi, type GalleryPhoto } from '@/lib/galleryApi';

export type { GalleryPhoto };

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await galleryApi.getPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    };

    loadPhotos();

    const handleCustomUpdate = () => {
      loadPhotos();
    };

    window.addEventListener('galleryUpdate', handleCustomUpdate);

    return () => {
      window.removeEventListener('galleryUpdate', handleCustomUpdate);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('gallery-scroll');
    if (!container) return;
    
    const scrollAmount = container.offsetWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.offsetWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (photos.length === 0) {
    return null;
  }

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < (document.getElementById('gallery-scroll')?.scrollWidth || 0) - (document.getElementById('gallery-scroll')?.offsetWidth || 0);

  return (
    <>
      <section className="py-20 bg-background" id="gallery">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Фотогалерея
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Моменты из жизни спортивного зала
            </p>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg disabled:opacity-50"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <Icon name="ChevronLeft" size={24} />
            </Button>

            <div 
              id="gallery-scroll"
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            >
              {photos.map((photo) => (
                <Card 
                  key={photo.id}
                  className="flex-shrink-0 w-[300px] md:w-[400px] overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Icon 
                        name="ZoomIn" 
                        size={32} 
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg disabled:opacity-50"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <Icon name="ChevronRight" size={24} />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.title}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {selectedPhoto.description && (
                <p className="text-muted-foreground">
                  {selectedPhoto.description}
                </p>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedPhoto(null)}
              >
                <Icon name="X" size={16} className="mr-2" />
                Закрыть
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
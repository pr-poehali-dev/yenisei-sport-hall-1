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

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    const loadPhotos = () => {
      const savedPhotos = localStorage.getItem('galleryPhotos');
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    };

    loadPhotos();

    // Обновляем галерею при изменениях в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'galleryPhotos') {
        loadPhotos();
      }
    };

    // Обновляем галерею при изменениях в текущей вкладке
    const handleCustomUpdate = () => {
      loadPhotos();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('galleryUpdate', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('galleryUpdate', handleCustomUpdate);
    };
  }, []);

  if (photos.length === 0) {
    return null;
  }

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card 
                key={photo.id}
                className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
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
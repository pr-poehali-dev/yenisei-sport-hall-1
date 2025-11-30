export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
}

const API_URL = 'https://functions.poehali.dev/21d3a217-68ef-4999-967c-a520ffcd414b';

export const galleryApi = {
  async getPhotos(): Promise<GalleryPhoto[]> {
    const response = await fetch(`${API_URL}?type=gallery`);
    if (!response.ok) throw new Error('Ошибка загрузки фото');
    return await response.json();
  },

  async addPhoto(photo: Omit<GalleryPhoto, 'id'>): Promise<GalleryPhoto> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'gallery',
        data: photo
      })
    });
    
    if (!response.ok) throw new Error('Ошибка добавления фото');
    const result = await response.json();
    window.dispatchEvent(new Event('galleryUpdate'));
    return {
      id: result.id,
      url: result.url,
      title: result.title,
      description: result.description
    };
  },

  async updatePhoto(id: string, data: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'gallery',
        data: { id, ...data }
      })
    });
    
    if (!response.ok) throw new Error('Ошибка обновления фото');
    window.dispatchEvent(new Event('galleryUpdate'));
    return { id, ...data } as GalleryPhoto;
  },

  async deletePhoto(id: string): Promise<void> {
    const response = await fetch(`${API_URL}?type=gallery&id=${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Ошибка удаления фото');
    window.dispatchEvent(new Event('galleryUpdate'));
  }
};
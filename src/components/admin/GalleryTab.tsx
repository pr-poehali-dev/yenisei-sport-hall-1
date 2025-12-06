import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { galleryApi, type GalleryPhoto } from '@/lib/galleryApi';

export default function GalleryTab() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const { toast } = useToast();

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await galleryApi.getPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Error loading photos:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить фото',
          variant: 'destructive'
        });
      }
    };
    loadPhotos();
  }, [toast]);

  const loadPhotos = async () => {
    try {
      const data = await galleryApi.getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.title) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await galleryApi.updatePhoto(editingId, formData);
        toast({
          title: 'Фото обновлено',
          description: 'Изменения сохранены'
        });
        setEditingId(null);
      } else {
        await galleryApi.addPhoto(formData);
        toast({
          title: 'Фото добавлено',
          description: 'Новое фото появилось в галерее'
        });
        setIsAdding(false);
      }
      await loadPhotos();
      setFormData({ url: '', title: '', description: '' });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить фото',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setFormData({
      url: photo.url,
      title: photo.title,
      description: photo.description || ''
    });
    setEditingId(photo.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await galleryApi.deletePhoto(id);
      await loadPhotos();
      toast({
        title: 'Фото удалено',
        description: 'Фотография удалена из галереи'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить фото',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setFormData({ url: '', title: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
    setUploadMethod('file');
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Не удалось создать canvas'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          const quality = 0.8;
          const compressedData = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedData);
        };
        
        img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.size, file.type);

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только изображения',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 10 МБ',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const originalSize = file.size;
      console.log('Сжимаю изображение...');
      
      const compressedData = await compressImage(file);
      const compressedSize = Math.round((compressedData.length * 3) / 4);
      const savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);
      
      console.log(`Сжато: ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB (−${savedPercent}%)`);
      
      const response = await fetch('https://functions.poehali.dev/b09c83ad-8ea7-4412-bd92-a45a3a2d32cd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: compressedData,
          filename: file.name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || 'Ошибка загрузки файла');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      setFormData(prev => ({ ...prev, url: data.url }));
      
      toast({
        title: 'Фото загружено',
        description: `Размер уменьшен на ${savedPercent}%`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить файл',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Image" size={20} />
                Управление фотогалереей
              </CardTitle>
              <CardDescription>
                Добавляйте, редактируйте и удаляйте фотографии
              </CardDescription>
            </div>
            {!isAdding && !editingId && (
              <Button onClick={() => setIsAdding(true)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить фото
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(isAdding || editingId) && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label>Способ добавления</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={uploadMethod === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('file')}
                    className="flex-1"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить файл
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'url' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('url')}
                    className="flex-1"
                  >
                    <Icon name="Link" size={16} className="mr-2" />
                    Вставить URL
                  </Button>
                </div>
              </div>
              {uploadMethod === 'url' ? (
                <div className="space-y-2">
                  <Label htmlFor="photo-url">URL фотографии *</Label>
                  <Input
                    id="photo-url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label>Выберите источник *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => document.getElementById('photo-from-camera')?.click()}
                      disabled={isUploading}
                    >
                      <Icon name="Camera" size={24} />
                      <span className="text-sm">Камера</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => document.getElementById('photo-from-gallery')?.click()}
                      disabled={isUploading}
                    >
                      <Icon name="Image" size={24} />
                      <span className="text-sm">Галерея</span>
                    </Button>
                  </div>
                  <Input
                    id="photo-from-camera"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Input
                    id="photo-from-gallery"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                  />
                  {isUploading && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Загрузка файла...
                    </p>
                  )}
                  {formData.url && !isUploading && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} />
                        Файл загружен
                      </p>
                      <img 
                        src={formData.url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="photo-title">Название *</Label>
                <Input
                  id="photo-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Название фотографии"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-description">Описание (необязательно)</Label>
                <Textarea
                  id="photo-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Краткое описание фотографии"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Icon name="Save" size={16} className="mr-2" />
                  {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          )}

          {photos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Image" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Фотографий пока нет</p>
              <p className="text-sm mt-2">Нажмите "Добавить фото" чтобы начать</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EНет фото%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(photo)}
                        className="flex-1"
                      >
                        <Icon name="Edit" size={14} className="mr-1" />
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(photo.id)}
                        className="flex-1"
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
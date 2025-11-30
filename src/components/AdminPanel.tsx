import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { ContactsTab } from '@/components/admin/ContactsTab';
import { SportsTab } from '@/components/admin/SportsTab';
import { DocumentsTab } from '@/components/admin/DocumentsTab';
import { FeedbackTab } from '@/components/admin/FeedbackTab';
import { PasswordTab } from '@/components/admin/PasswordTab';
import GalleryTab from '@/components/admin/GalleryTab';

interface Contact {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface Sport {
  id: string;
  name: string;
  image: string;
  rules: string[];
  safety: string[];
  video: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact;
  sports: Sport[];
  onUpdateContacts: (contacts: Contact) => void;
  onUpdateSports: (sports: Sport[]) => void;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AdminPanel = ({ isOpen, onClose, contacts, sports, onUpdateContacts, onUpdateSports, onPasswordChange }: AdminPanelProps) => {
  const [editedContacts, setEditedContacts] = useState(contacts);
  const [editedSports, setEditedSports] = useState(sports);
  const [feedbackStats, setFeedbackStats] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({
    rules: 'idle',
    prices: 'idle',
    benefits: 'idle',
    schedule: 'idle'
  });

  useEffect(() => {
    if (isOpen) {
      loadFeedbackStats();
    }
  }, [isOpen]);

  const loadFeedbackStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?archived=false');
      const activeData = await response.json();
      
      const archivedResponse = await fetch('https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?archived=true');
      const archivedData = await archivedResponse.json();
      
      setFeedbackStats({
        feedback: [...activeData.feedback, ...archivedData.feedback],
        total_count: activeData.total_count,
        unread_count: activeData.unread_count,
        archived_count: activeData.archived_count
      });
    } catch (error) {
      console.error('Failed to load feedback stats:', error);
    }
  };

  const handleSaveContacts = async () => {
    console.log('=== handleSaveContacts START ===');
    
    try {
      const url = `https://functions.poehali.dev/21d3a217-68ef-4999-967c-a520ffcd414b?_t=${Date.now()}`;
      
      console.log('Sending request to:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          type: 'contacts',
          data: editedContacts
        })
      });
      
      console.log('Response received:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Ошибка ${response.status}: ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('Success:', result);
      console.log('editedContacts to save:', editedContacts);
      console.log('onUpdateContacts type:', typeof onUpdateContacts);
      
      onUpdateContacts(editedContacts);
      alert('Контакты успешно обновлены!');
      
    } catch (err) {
      console.error('ERROR:', err);
      alert('Ошибка: ' + (err instanceof Error ? err.message : String(err)));
    }
    
    console.log('=== handleSaveContacts END ===');
  };

  const handleSaveSports = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/21d3a217-68ef-4999-967c-a520ffcd414b', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sports',
          data: editedSports
        })
      });
      
      if (response.ok) {
        onUpdateSports(editedSports);
        toast({
          title: 'Виды спорта обновлены',
          description: 'Изменения успешно сохранены в базе данных',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive'
      });
    }
  };

  const updateContactField = (field: keyof Contact, value: string) => {
    setEditedContacts({ ...editedContacts, [field]: value });
  };

  const updateSportField = (index: number, field: keyof Sport, value: string | string[]) => {
    const updated = [...editedSports];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSports(updated);
  };

  const updateSportRules = (sportIndex: number, ruleIndex: number, value: string) => {
    const updated = [...editedSports];
    const rules = [...updated[sportIndex].rules];
    rules[ruleIndex] = value;
    updated[sportIndex] = { ...updated[sportIndex], rules };
    setEditedSports(updated);
  };

  const updateSportSafety = (sportIndex: number, safetyIndex: number, value: string) => {
    const updated = [...editedSports];
    const safety = [...updated[sportIndex].safety];
    safety[safetyIndex] = value;
    updated[sportIndex] = { ...updated[sportIndex], safety };
    setEditedSports(updated);
  };

  const addSportRule = (sportIndex: number) => {
    const updated = [...editedSports];
    updated[sportIndex].rules.push('Новое правило');
    setEditedSports(updated);
  };

  const removeSportRule = (sportIndex: number, ruleIndex: number) => {
    const updated = [...editedSports];
    updated[sportIndex].rules.splice(ruleIndex, 1);
    setEditedSports(updated);
  };

  const addSportSafety = (sportIndex: number) => {
    const updated = [...editedSports];
    updated[sportIndex].safety.push('Новое правило безопасности');
    setEditedSports(updated);
  };

  const removeSportSafety = (sportIndex: number, safetyIndex: number) => {
    const updated = [...editedSports];
    updated[sportIndex].safety.splice(safetyIndex, 1);
    setEditedSports(updated);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только PDF файлы',
        variant: 'destructive'
      });
      return;
    }

    setUploadStatus(prev => ({ ...prev, [docType]: 'uploading' }));

    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const base64Content = base64Data.split(',')[1];

          const response = await fetch('https://functions.poehali.dev/f86464fd-afbd-480b-a209-1e5d436e180f', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docType: docType,
              fileData: base64Content
            })
          });

          if (response.ok) {
            setUploadStatus(prev => ({ ...prev, [docType]: 'success' }));
            toast({
              title: 'Документ загружен',
              description: `Файл ${file.name} успешно загружен`,
            });
            setTimeout(() => {
              setUploadStatus(prev => ({ ...prev, [docType]: 'idle' }));
            }, 3000);
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
          toast({
            title: 'Ошибка',
            description: 'Не удалось загрузить документ',
            variant: 'destructive'
          });
          setTimeout(() => {
            setUploadStatus(prev => ({ ...prev, [docType]: 'idle' }));
          }, 3000);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
      toast({
        title: 'Ошибка',
        description: 'Не удалось прочитать файл',
        variant: 'destructive'
      });
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [docType]: 'idle' }));
      }, 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Панель администратора
          </DialogTitle>
          <DialogDescription>
            Управление контентом сайта
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-1 h-auto">
            <TabsTrigger value="contacts" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Контакты</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                Контакты
              </span>
            </TabsTrigger>
            <TabsTrigger value="sports" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Виды спорта</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="Dumbbell" size={14} />
                Спорт
              </span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Фотогалерея</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="Image" size={14} />
                Фото
              </span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Документы</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="FileText" size={14} />
                Файлы
              </span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Отзывы</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="MessageSquare" size={14} />
                Отзывы
              </span>
            </TabsTrigger>
            <TabsTrigger value="password" className="text-xs md:text-sm py-2">
              <span className="hidden md:inline">Безопасность</span>
              <span className="md:hidden flex items-center gap-1">
                <Icon name="Lock" size={14} />
                Пароль
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <ContactsTab
              editedContacts={editedContacts}
              onContactChange={updateContactField}
              onSave={handleSaveContacts}
            />
          </TabsContent>

          <TabsContent value="sports" className="space-y-4">
            <SportsTab
              editedSports={editedSports}
              onSportFieldChange={updateSportField}
              onRuleChange={updateSportRules}
              onSafetyChange={updateSportSafety}
              onAddRule={addSportRule}
              onRemoveRule={removeSportRule}
              onAddSafety={addSportSafety}
              onRemoveSafety={removeSportSafety}
              onSave={handleSaveSports}
            />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <GalleryTab />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab
              uploadStatus={uploadStatus}
              onDocumentUpload={handleDocumentUpload}
            />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <FeedbackTab
              feedbackStats={feedbackStats}
              onRefresh={loadFeedbackStats}
            />
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <PasswordTab
              onPasswordChange={onPasswordChange}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
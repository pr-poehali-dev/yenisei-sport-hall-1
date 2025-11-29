import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
}

const AdminPanel = ({ isOpen, onClose, contacts, sports, onUpdateContacts, onUpdateSports }: AdminPanelProps) => {
  const [editedContacts, setEditedContacts] = useState(contacts);
  const [editedSports, setEditedSports] = useState(sports);
  const [feedbackStats, setFeedbackStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadFeedbackStats();
    }
  }, [isOpen]);

  const loadFeedbackStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9f020406-6628-478f-ada2-5920d21f64b2');
      const data = await response.json();
      setFeedbackStats(data);
    } catch (error) {
      console.error('Failed to load feedback stats:', error);
    }
  };

  const handleSaveContacts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/21d3a217-68ef-4999-967c-a520ffcd414b', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contacts',
          data: editedContacts
        })
      });
      
      if (response.ok) {
        onUpdateContacts(editedContacts);
        toast({
          title: 'Контакты обновлены',
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



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Панель администратора
          </DialogTitle>
          <DialogDescription>
            Управление контентом сайта
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="sports">Виды спорта</TabsTrigger>
            <TabsTrigger value="documents">Документы</TabsTrigger>
            <TabsTrigger value="feedback">
              Сообщения ({feedbackStats?.total_count || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Редактирование контактов</CardTitle>
                <CardDescription>Измените контактную информацию</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    value={editedContacts.address}
                    onChange={(e) => setEditedContacts({ ...editedContacts, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={editedContacts.phone}
                    onChange={(e) => setEditedContacts({ ...editedContacts, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedContacts.email}
                    onChange={(e) => setEditedContacts({ ...editedContacts, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Режим работы</Label>
                  <Input
                    id="hours"
                    value={editedContacts.hours}
                    onChange={(e) => setEditedContacts({ ...editedContacts, hours: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveContacts} className="w-full">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление документами</CardTitle>
                <CardDescription>Инструкция по добавлению PDF файлов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm font-medium">Для добавления документов:</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>Создайте папку <code className="bg-background px-2 py-1 rounded">public/docs/</code> в корне проекта</li>
                    <li>Поместите в неё PDF файлы с названиями:
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>• <code className="bg-background px-2 py-1 rounded">rules.pdf</code> - Правила посещения</li>
                        <li>• <code className="bg-background px-2 py-1 rounded">prices.pdf</code> - Прейскурант цен</li>
                        <li>• <code className="bg-background px-2 py-1 rounded">benefits.pdf</code> - Перечень льготников</li>
                      </ul>
                    </li>
                    <li>Файлы автоматически станут доступны по ссылкам в футере</li>
                  </ol>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    💡 Совет: Используйте GitHub интеграцию для удобного управления файлами проекта
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sports" className="space-y-4 mt-4">
            {editedSports.map((sport, sportIndex) => (
              <Card key={sport.id}>
                <CardHeader>
                  <CardTitle>{sport.name}</CardTitle>
                  <CardDescription>Редактирование информации о виде спорта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={sport.name}
                      onChange={(e) => updateSportField(sportIndex, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL изображения</Label>
                    <Input
                      value={sport.image}
                      onChange={(e) => updateSportField(sportIndex, 'image', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL видео</Label>
                    <div className="flex gap-2">
                      <Input
                        value={sport.video}
                        onChange={(e) => updateSportField(sportIndex, 'video', e.target.value)}
                        placeholder="https://rutube.ru/play/embed/..."
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(sport.video, '_blank')}
                        disabled={!sport.video}
                      >
                        <Icon name="ExternalLink" size={16} className="mr-1" />
                        Проверить
                      </Button>
                    </div>
                    {sport.video && (
                      <div className="mt-2 rounded-lg overflow-hidden border">
                        <iframe
                          src={sport.video}
                          width="100%"
                          height="300"
                          allow="clipboard-write; autoplay"
                          allowFullScreen
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Правила игры</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSportRule(sportIndex)}
                      >
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                    {sport.rules.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex gap-2">
                        <Textarea
                          value={rule}
                          onChange={(e) => updateSportRules(sportIndex, ruleIndex, e.target.value)}
                          rows={2}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeSportRule(sportIndex, ruleIndex)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Техника безопасности</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSportSafety(sportIndex)}
                      >
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                    {sport.safety.map((item, safetyIndex) => (
                      <div key={safetyIndex} className="flex gap-2">
                        <Textarea
                          value={item}
                          onChange={(e) => updateSportSafety(sportIndex, safetyIndex, e.target.value)}
                          rows={2}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeSportSafety(sportIndex, safetyIndex)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveSports} className="w-full">
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageSquare" size={24} />
                  Статистика сообщений
                </CardTitle>
                <CardDescription>
                  Всего получено сообщений: {feedbackStats?.total_count || 0}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackStats?.recent_messages?.length > 0 ? (
                  feedbackStats.recent_messages.map((msg: any, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{msg.name}</CardTitle>
                            <CardDescription>{msg.email}</CardDescription>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleString('ru-RU')}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Сообщений пока нет</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
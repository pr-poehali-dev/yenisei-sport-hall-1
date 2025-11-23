import { useState } from 'react';
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
  const { toast } = useToast();

  const handleSaveContacts = () => {
    onUpdateContacts(editedContacts);
    toast({
      title: 'Контакты обновлены',
      description: 'Изменения успешно сохранены',
    });
  };

  const handleSaveSports = () => {
    onUpdateSports(editedSports);
    toast({
      title: 'Виды спорта обновлены',
      description: 'Изменения успешно сохранены',
    });
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="sports">Виды спорта</TabsTrigger>
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
                    <Input
                      value={sport.video}
                      onChange={(e) => updateSportField(sportIndex, 'video', e.target.value)}
                    />
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;

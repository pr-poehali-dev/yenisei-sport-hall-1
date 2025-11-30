import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Contact {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface ContactsTabProps {
  editedContacts: Contact;
  onContactChange: (field: keyof Contact, value: string) => void;
  onSave: () => void;
}

export const ContactsTab = ({ editedContacts, onContactChange, onSave }: ContactsTabProps) => {
  const handleSaveClick = () => {
    console.log('ContactsTab: Save button clicked!');
    console.log('ContactsTab: onSave function type:', typeof onSave);
    console.log('ContactsTab: editedContacts:', editedContacts);
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          Редактирование контактов
        </CardTitle>
        <CardDescription>
          Обновите контактную информацию
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Адрес</Label>
          <Input
            id="address"
            value={editedContacts.address}
            onChange={(e) => onContactChange('address', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            value={editedContacts.phone}
            onChange={(e) => onContactChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={editedContacts.email}
            onChange={(e) => onContactChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Режим работы</Label>
          <Input
            id="hours"
            value={editedContacts.hours}
            onChange={(e) => onContactChange('hours', e.target.value)}
          />
        </div>
        <Button onClick={handleSaveClick} className="w-full">
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить изменения
        </Button>
      </CardContent>
    </Card>
  );
};
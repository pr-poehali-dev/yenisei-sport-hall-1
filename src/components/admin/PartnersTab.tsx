import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export interface Partner {
  name: string;
  url: string;
}

interface PartnersTabProps {
  partners: Partner[];
  onUpdate: (partners: Partner[]) => void;
}

export const PartnersTab = ({ partners, onUpdate }: PartnersTabProps) => {
  const [editedPartners, setEditedPartners] = useState<Partner[]>(partners);

  const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
    const updated = [...editedPartners];
    updated[index] = { ...updated[index], [field]: value };
    setEditedPartners(updated);
  };

  const handleAddPartner = () => {
    setEditedPartners([...editedPartners, { name: 'Новый партнёр', url: 'https://' }]);
  };

  const handleRemovePartner = (index: number) => {
    const updated = editedPartners.filter((_, i) => i !== index);
    setEditedPartners(updated);
  };

  const handleSave = () => {
    onUpdate(editedPartners);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление партнёрами</h3>
        <Button onClick={handleAddPartner} size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить партнёра
        </Button>
      </div>

      <div className="space-y-4">
        {editedPartners.map((partner, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-base">Партнёр {index + 1}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemovePartner(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`partner-name-${index}`}>Название</Label>
                <Input
                  id={`partner-name-${index}`}
                  value={partner.name}
                  onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                  placeholder="Название организации"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`partner-url-${index}`}>Ссылка</Label>
                <Input
                  id={`partner-url-${index}`}
                  value={partner.url}
                  onChange={(e) => handlePartnerChange(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editedPartners.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Партнёры не добавлены</p>
          <p className="text-sm">Нажмите "Добавить партнёра" чтобы начать</p>
        </div>
      )}

      <Button onClick={handleSave} className="w-full">
        <Icon name="Save" size={16} className="mr-2" />
        Сохранить изменения
      </Button>
    </div>
  );
};

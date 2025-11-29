import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Sport {
  id: string;
  name: string;
  image: string;
  rules: string[];
  safety: string[];
  video: string;
}

interface SportsTabProps {
  editedSports: Sport[];
  onSportFieldChange: (index: number, field: keyof Sport, value: string | string[]) => void;
  onRuleChange: (sportIndex: number, ruleIndex: number, value: string) => void;
  onSafetyChange: (sportIndex: number, safetyIndex: number, value: string) => void;
  onAddRule: (sportIndex: number) => void;
  onRemoveRule: (sportIndex: number, ruleIndex: number) => void;
  onAddSafety: (sportIndex: number) => void;
  onRemoveSafety: (sportIndex: number, safetyIndex: number) => void;
  onSave: () => void;
}

export const SportsTab = ({
  editedSports,
  onSportFieldChange,
  onRuleChange,
  onSafetyChange,
  onAddRule,
  onRemoveRule,
  onAddSafety,
  onRemoveSafety,
  onSave
}: SportsTabProps) => {
  return (
    <div className="space-y-6">
      {editedSports.map((sport, sportIndex) => (
        <Card key={sport.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Dumbbell" size={20} />
              {sport.name}
            </CardTitle>
            <CardDescription>
              Редактирование информации о виде спорта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={sport.name}
                onChange={(e) => onSportFieldChange(sportIndex, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL изображения</Label>
              <Input
                value={sport.image}
                onChange={(e) => onSportFieldChange(sportIndex, 'image', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL видео</Label>
              <Input
                value={sport.video}
                onChange={(e) => onSportFieldChange(sportIndex, 'video', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Правила игры</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onAddRule(sportIndex)}
                >
                  <Icon name="Plus" size={14} className="mr-1" />
                  Добавить
                </Button>
              </div>
              {sport.rules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="flex gap-2">
                  <Textarea
                    value={rule}
                    onChange={(e) => onRuleChange(sportIndex, ruleIndex, e.target.value)}
                    rows={2}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveRule(sportIndex, ruleIndex)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Техника безопасности</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onAddSafety(sportIndex)}
                >
                  <Icon name="Plus" size={14} className="mr-1" />
                  Добавить
                </Button>
              </div>
              {sport.safety.map((item, safetyIndex) => (
                <div key={safetyIndex} className="flex gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => onSafetyChange(sportIndex, safetyIndex, e.target.value)}
                    rows={2}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveSafety(sportIndex, safetyIndex)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={onSave} className="w-full">
        <Icon name="Save" size={16} className="mr-2" />
        Сохранить все изменения
      </Button>
    </div>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PasswordTabProps {
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const PasswordTab = ({ onPasswordChange }: PasswordTabProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secretQuestion, setSecretQuestion] = useState(() => {
    return localStorage.getItem('secretQuestion') || 'Как называется спортивный зал?';
  });
  const [secretAnswer, setSecretAnswer] = useState(() => {
    return localStorage.getItem('secretAnswer') || 'енисей';
  });
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Новый пароль должен содержать минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Новый пароль и подтверждение не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: 'Ошибка',
        description: 'Новый пароль должен отличаться от текущего',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await onPasswordChange(currentPassword, newPassword);
      
      if (success) {
        toast({
          title: 'Пароль изменён',
          description: 'Ваш пароль успешно обновлён',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный текущий пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить пароль',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecretUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretQuestion.trim() || !secretAnswer.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    localStorage.setItem('secretQuestion', secretQuestion);
    localStorage.setItem('secretAnswer', secretAnswer.toLowerCase().trim());
    
    toast({
      title: 'Секретный вопрос обновлён',
      description: 'Теперь используйте новый вопрос для восстановления пароля',
    });
    
    setIsEditingSecret(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Lock" size={20} />
            Смена пароля
          </CardTitle>
          <CardDescription>
            Измените пароль для входа в панель администратора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтверждение пароля</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Изменение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Изменить пароль
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Секретный вопрос для восстановления
          </CardTitle>
          <CardDescription>
            Используется для восстановления доступа при потере пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditingSecret ? (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Текущий вопрос:</p>
                <p className="text-sm text-muted-foreground">{secretQuestion}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Ответ: {secretAnswer}
                </p>
              </div>
              <Button 
                onClick={() => setIsEditingSecret(true)}
                variant="outline"
                className="w-full"
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Изменить секретный вопрос
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSecretUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-question">Секретный вопрос</Label>
                <Input
                  id="secret-question"
                  type="text"
                  value={secretQuestion}
                  onChange={(e) => setSecretQuestion(e.target.value)}
                  placeholder="Например: Как зовут вашего первого питомца?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret-answer">Ответ на вопрос</Label>
                <Input
                  id="secret-answer"
                  type="text"
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  placeholder="Введите ответ"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ответ будет сохранён в нижнем регистре без пробелов по краям
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSecretQuestion(localStorage.getItem('secretQuestion') || 'Как называется спортивный зал?');
                    setSecretAnswer(localStorage.getItem('secretAnswer') || 'енисей');
                    setIsEditingSecret(false);
                  }}
                  className="flex-1"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
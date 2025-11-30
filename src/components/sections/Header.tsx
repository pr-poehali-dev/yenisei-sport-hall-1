import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import MobileMenu from '@/components/MobileMenu';

interface HeaderProps {
  isAdmin: boolean;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (value: boolean) => void;
  loginError: string;
  handleAdminLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsAdminPanelOpen: (value: boolean) => void;
  unreadCount: number;
  handleAdminLogout: () => void;
}

const Header = ({
  isAdmin,
  isAdminLoginOpen,
  setIsAdminLoginOpen,
  loginError,
  handleAdminLogin,
  setIsAdminPanelOpen,
  unreadCount,
  handleAdminLogout
}: HeaderProps) => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const answer = formData.get('secret-answer') as string;
    const newPassword = formData.get('new-password') as string;
    
    const correctAnswer = localStorage.getItem('secretAnswer') || 'енисей';
    
    if (answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      localStorage.setItem('adminPassword', newPassword);
      setResetSuccess('Пароль успешно изменен! Теперь войдите с новым паролем.');
      setResetError('');
      setTimeout(() => {
        setShowPasswordReset(false);
        setResetSuccess('');
      }, 2000);
    } else {
      setResetError('Неверный ответ на секретный вопрос');
      setResetSuccess('');
    }
  };

  const secretQuestion = localStorage.getItem('secretQuestion') || 'Как называется спортивный зал?';

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Спортивный зал "Енисей"</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#sports" className="hover:underline">Виды спорта</a>
            <a href="#feedback" className="hover:underline">Обратная связь</a>
            <a href="#about" className="hover:underline">О проекте</a>
            <a href="#contacts" className="hover:underline">Контакты</a>
            {!isAdmin && (
              <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
                <DialogTrigger asChild>
                  <button className="hover:underline hidden md:inline cursor-pointer">
                    Вход
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Вход для администратора</DialogTitle>
                    <DialogDescription>
                      Введите логин и пароль для доступа к панели управления
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    {loginError && (
                      <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                        {loginError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-login">Логин</Label>
                      <Input 
                        id="admin-login"
                        name="login"
                        type="text" 
                        placeholder="Введите логин" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Пароль</Label>
                      <Input 
                        id="admin-password"
                        name="password"
                        type="password" 
                        placeholder="Введите пароль" 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Войти
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      className="text-sm text-primary hover:underline w-full text-center"
                    >
                      Забыли пароль?
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
            <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Восстановление пароля</DialogTitle>
                  <DialogDescription>
                    Ответьте на секретный вопрос для сброса пароля
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {resetError && (
                    <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                      {resetError}
                    </div>
                  )}
                  {resetSuccess && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
                      {resetSuccess}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="secret-question">Секретный вопрос</Label>
                    <p className="text-sm text-muted-foreground">
                      {secretQuestion}
                    </p>
                    <Input 
                      id="secret-answer"
                      name="secret-answer"
                      type="text" 
                      placeholder="Введите ответ" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input 
                      id="new-password"
                      name="new-password"
                      type="password" 
                      placeholder="Введите новый пароль" 
                      required 
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Сбросить пароль
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordReset(false);
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className="text-sm text-primary hover:underline w-full text-center"
                  >
                    Вернуться к входу
                  </button>
                </form>
              </DialogContent>
            </Dialog>
            {isAdmin && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 relative"
                >
                  <Icon name="Settings" size={16} className="mr-2" />
                  Управление
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAdminLogout}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выход
                </Button>
              </>
            )}
          </nav>
          <MobileMenu 
            isAdmin={isAdmin}
            onAdminPanelOpen={() => setIsAdminPanelOpen(true)}
            onAdminLoginOpen={() => setIsAdminLoginOpen(true)}
            onAdminLogout={handleAdminLogout}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
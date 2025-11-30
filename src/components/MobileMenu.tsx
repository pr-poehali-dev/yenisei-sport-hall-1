import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileMenuProps {
  isAdmin: boolean;
  unreadCount: number;
  onAdminPanelOpen: () => void;
  onAdminLoginOpen: () => void;
  onAdminLogout: () => void;
}

const MobileMenu = ({ isAdmin, unreadCount, onAdminPanelOpen, onAdminLoginOpen, onAdminLogout }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
          <Icon name="Menu" size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          <button 
            onClick={() => handleNavClick('#sports')}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Icon name="Dumbbell" size={20} />
            <span className="font-medium">Виды спорта</span>
          </button>
          
          <button 
            onClick={() => handleNavClick('#documents')}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Icon name="FileText" size={20} />
            <span className="font-medium">Документы</span>
          </button>

          <button 
            onClick={() => handleNavClick('#feedback')}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Icon name="MessageSquare" size={20} />
            <span className="font-medium">Обратная связь</span>
          </button>

          <button 
            onClick={() => handleNavClick('#about')}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Icon name="Info" size={20} />
            <span className="font-medium">О проекте</span>
          </button>

          <button 
            onClick={() => handleNavClick('#contacts')}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Icon name="MapPin" size={20} />
            <span className="font-medium">Контакты</span>
          </button>

          <div className="border-t pt-4 mt-2">
            {isAdmin ? (
              <>
                <button 
                  onClick={() => {
                    setOpen(false);
                    onAdminPanelOpen();
                  }}
                  className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors w-full relative"
                >
                  <Icon name="Settings" size={20} />
                  <span className="font-medium">Управление</span>
                  {unreadCount > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setOpen(false);
                    onAdminLogout();
                  }}
                  className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors w-full text-destructive"
                >
                  <Icon name="LogOut" size={20} />
                  <span className="font-medium">Выход</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setOpen(false);
                  onAdminLoginOpen();
                }}
                className="flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors w-full"
              >
                <Icon name="LogIn" size={20} />
                <span className="font-medium">Вход</span>
              </button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

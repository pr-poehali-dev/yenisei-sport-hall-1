import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminPanel from '@/components/AdminPanel';
import Header from '@/components/sections/Header';
import SportsSection from '@/components/sections/SportsSection';
import FeedbackSection from '@/components/sections/FeedbackSection';
import UsefulSection from '@/components/sections/UsefulSection';
import FooterSections from '@/components/sections/FooterSections';

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || 'admin2025';
  });
  const [loginError, setLoginError] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const [contacts, setContacts] = useState({
    address: 'г. Красноярск, о. Отдыха, 12',
    phone: '+7 (391) 989-10-82',
    email: 'mail@krascsp.ru',
    hours: 'Ежедневно: 08:00 - 22:00'
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/21d3a217-68ef-4999-967c-a520ffcd414b');
        const data = await response.json();
        
        if (data.contacts) {
          setContacts(data.contacts);
        }
        if (data.sports) {
          setSports(data.sports);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };
    
    loadContent();
    
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession) {
      const session = JSON.parse(adminSession);
      if (session.expiresAt > Date.now()) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('adminSession');
      }
    }
    
    generateCaptcha();
    
    if (isAdmin) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
    setCaptchaInput('');
  };

  const loadUnreadCount = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch('https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?archived=false');
      const data = await response.json();
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const [sports, setSports] = useState([
    {
      id: 'basketball',
      name: 'Баскетбол',
      image: 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/a81ec216-b3dc-426d-bb6d-1824927ff897.jpg',
      rules: [
        'Игра состоит из 4 периодов по 10 минут',
        'Цель - забросить мяч в кольцо соперника',
        'За бросок из-за 3-х очковой линии начисляется 3 очка',
        'Запрещены пробежки и двойное ведение',
        'Команда состоит из 5 игроков на площадке'
      ],
      safety: [
        'Используйте спортивную обувь с нескользящей подошвой',
        'Снимите все украшения перед игрой',
        'Разминайтесь перед началом игры',
        'Соблюдайте правила игры и не допускайте грубых столкновений',
        'При получении травмы немедленно обратитесь к медперсоналу'
      ],
      video: 'https://rutube.ru/play/embed/8446c8876591ad39269db4c75cbc11c2'
    },
    {
      id: 'handball',
      name: 'Гандбол',
      image: 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/84e8379c-eb4d-4ffa-8bca-6d2993b5498e.jpg',
      rules: [
        'Игра состоит из 2 таймов по 30 минут',
        'Цель - забросить мяч в ворота соперника',
        'Команда состоит из 7 игроков (6 полевых + вратарь)',
        'Можно делать максимум 3 шага с мячом',
        'Запрещено входить в зону вратаря'
      ],
      safety: [
        'Используйте защитные наколенники и налокотники',
        'Обязательна спортивная обувь',
        'Вратарь должен использовать специальную защиту',
        'Разминка перед игрой обязательна',
        'Соблюдайте дистанцию при бросках'
      ],
      video: 'https://rutube.ru/play/embed/b354eb5c2c9e0c38b5ac02e8d1a5e9f1'
    },
    {
      id: 'futsal',
      name: 'Мини-футбол',
      image: 'https://cdn.poehali.dev/files/6c27196a-5bd3-4d6e-ae3c-247391012530.jpg',
      rules: [
        'Игра состоит из 2 таймов по 20 минут',
        'Команда состоит из 5 игроков (4 полевых + вратарь)',
        'Цель - забить мяч в ворота соперника',
        'Замены игроков неограниченны',
        'Запрещены подкаты и грубая игра'
      ],
      safety: [
        'Используйте щитки для защиты голени',
        'Обувь должна быть специальной для зала',
        'Разминка обязательна',
        'Не играйте в мокрой обуви',
        'Соблюдайте правила честной игры'
      ],
      video: 'https://rutube.ru/play/embed/c7e5f8d4e9c8b7a6f5d4c3b2a1e9d8c7'
    },
    {
      id: 'volleyball',
      name: 'Волейбол',
      image: 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/f571584e-2fe2-43d9-b3d1-5e1d1d9022cf.jpg',
      rules: [
        'Игра состоит из 5 партий до 25 очков',
        'Команда состоит из 6 игроков на площадке',
        'Цель - перебить мяч через сетку на сторону соперника',
        'Максимум 3 касания мяча на одной стороне',
        'Нельзя касаться сетки во время игры'
      ],
      safety: [
        'Используйте наколенники для защиты суставов',
        'Обувь должна быть с хорошей амортизацией',
        'Разминка и растяжка обязательны',
        'Не наступайте на среднюю линию',
        'Координируйте действия с партнерами'
      ],
      video: 'https://rutube.ru/play/embed/d8a7b6c5e4f3g2h1i0j9k8l7m6n5o4p3'
    },
    {
      id: 'floorball',
      name: 'Флорбол',
      image: 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/e8d11747-08f6-44e4-bb11-f5a32dab2853.jpg',
      rules: [
        'Игра состоит из 3 периодов по 20 минут',
        'Команда состоит из 6 игроков (5 полевых + вратарь)',
        'Цель - забить мяч клюшкой в ворота соперника',
        'Запрещено поднимать клюшку выше колена',
        'Нельзя играть без клюшки и толкать соперника'
      ],
      safety: [
        'Используйте защитные очки',
        'Вратарь должен иметь полную защиту',
        'Обувь с нескользящей подошвой обязательна',
        'Не размахивайте клюшкой на уровне головы',
        'Следите за положением клюшки других игроков'
      ],
      video: 'https://rutube.ru/play/embed/e9f8g7h6i5j4k3l2m1n0o9p8q7r6s5t4'
    }
  ]);

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (parseInt(captchaInput) !== captcha.answer) {
      toast({
        title: 'Ошибка',
        description: 'Неверный ответ на вопрос. Попробуйте снова.',
        variant: 'destructive'
      });
      generateCaptcha();
      return;
    }
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    console.log('Sending feedback:', { name, email, message });

    try {
      const response = await fetch('https://functions.poehali.dev/0df7b0be-d24f-4940-a122-87ceefd9b518', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      toast({
        title: 'Спасибо за отзыв!',
        description: 'Ваше сообщение отправлено администратору',
      });
      generateCaptcha();
      form.reset();
      setCaptchaInput('');
      if (isAdmin) {
        loadUnreadCount();
      }
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive'
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (login === 'admin' && password === adminPassword) {
      const session = {
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      localStorage.setItem('adminSession', JSON.stringify(session));
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      setLoginError('');
      loadUnreadCount();
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать, администратор!',
      });
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handlePasswordChange = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (oldPassword !== adminPassword) {
      return false;
    }

    setAdminPassword(newPassword);
    localStorage.setItem('adminPassword', newPassword);
    
    toast({
      title: 'Пароль изменен',
      description: 'Новый пароль успешно сохранен',
    });
    
    return true;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    setUnreadCount(0);
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
  };

  const handleContactsUpdate = (newContacts: typeof contacts) => {
    setContacts(newContacts);
  };

  const handleSportsUpdate = (newSports: typeof sports) => {
    setSports(newSports);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAdmin={isAdmin}
        isAdminLoginOpen={isAdminLoginOpen}
        setIsAdminLoginOpen={setIsAdminLoginOpen}
        loginError={loginError}
        handleAdminLogin={handleAdminLogin}
        setIsAdminPanelOpen={setIsAdminPanelOpen}
        unreadCount={unreadCount}
        handleAdminLogout={handleAdminLogout}
      />

      <SportsSection
        sports={sports}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
      />

      <FeedbackSection
        handleFeedbackSubmit={handleFeedbackSubmit}
        captcha={captcha}
        captchaInput={captchaInput}
        setCaptchaInput={setCaptchaInput}
      />

      <FooterSections contacts={contacts} />

      <UsefulSection />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onPasswordChange={handlePasswordChange}
        onContactsUpdate={handleContactsUpdate}
        onSportsUpdate={handleSportsUpdate}
        contacts={contacts}
        sports={sports}
        onUnreadCountChange={loadUnreadCount}
      />
    </div>
  );
};

export default Index;
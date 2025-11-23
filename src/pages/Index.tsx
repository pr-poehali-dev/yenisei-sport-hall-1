import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
      const response = await fetch('https://functions.poehali.dev/9f020406-6628-478f-ada2-5920d21f64b2');
      const data = await response.json();
      setUnreadCount(data.total_count || 0);
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

      if (!response.ok) {
        const data = await response.json();
        console.error('Error response:', response.status, data);
        throw new Error(data.error || 'Server error');
      }

      const data = await response.json();
      console.log('Success response:', response.status, data);

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

    if (login === 'admin' && password === 'admin2025') {
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

  const handleAdminLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    toast({
      title: 'Выход выполнен',
      description: 'До свидания!',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-4xl font-bold">
              Спортивный зал "Енисей"
            </h1>
            <nav className="flex gap-6 items-center">
              <a href="#sports" className="hover:underline hidden md:inline">Виды спорта</a>
              <a href="#feedback" className="hover:underline hidden md:inline">Обратная связь</a>
              <a href="#about" className="hover:underline hidden md:inline">О проекте</a>
              <a href="#contacts" className="hover:underline hidden md:inline">Контакты</a>
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
          </div>
        </div>
      </header>

      <section className="py-8 pb-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-foreground">
              Бизнес-спринт (Я выбираю спорт)
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Устройство спортивного зала выполнено в рамках Федерального проекта "Бизнес-спринт" (Я выбираю спорт) национального проекта "Демография"
            </p>
            <div className="mt-8 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://cdn.poehali.dev/files/a7e7ca58-fd77-450f-8aff-a19d887c22e0.jpg" 
                alt="Спортивный зал Енисей" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="sports" className="pt-4 pb-6 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Игровые виды спорта в нашем зале
          </h2>

          <div className="grid grid-cols-5 gap-4 mb-12">
            {sports.map((sport) => (
              <Card key={sport.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale">
                <div className="h-32 overflow-hidden">
                  <img 
                    src={sport.image} 
                    alt={sport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-3">
                  <CardTitle className="text-lg">{sport.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm" onClick={() => setSelectedSport(sport.id)}>
                        Подробнее <Icon name="ChevronRight" className="ml-1" size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{sport.name}</DialogTitle>
                        <DialogDescription>
                          Правила игры, техника безопасности и видео-инструкции
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Icon name="BookOpen" size={24} className="text-primary" />
                            Правила игры
                          </h3>
                          <ul className="space-y-2">
                            {sport.rules.map((rule, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Icon name="Shield" size={24} className="text-secondary" />
                            Техника безопасности
                          </h3>
                          <ul className="space-y-2">
                            {sport.safety.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Icon name="AlertTriangle" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Icon name="Video" size={24} className="text-primary" />
                            Видео-инструкция
                          </h3>
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <iframe
                              src={sport.video}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              allow="clipboard-write; autoplay"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="feedback" className="pt-20 pb-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Форма обратной связи
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Оставьте отзыв о работе сервиса</CardTitle>
                <CardDescription>
                  Ваше мнение поможет нам улучшить качество обслуживания
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" name="name" placeholder="Введите ваше имя" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="example@mail.ru" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea 
                      id="message"
                      name="message" 
                      placeholder="Ваш отзыв или предложение" 
                      rows={5}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captcha" className="flex items-center gap-2">
                      <Icon name="Shield" size={18} className="text-primary" />
                      Проверка: Сколько будет {captcha.num1} + {captcha.num2}?
                    </Label>
                    <Input 
                      id="captcha" 
                      type="number" 
                      placeholder="Введите ответ"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Отправить отзыв
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="pt-4 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Информация о проекте
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="about">
                <AccordionTrigger className="text-xl font-semibold">
                  О проекте
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  <p className="mb-4">
                    Спортивный зал "Енисей" создан в рамках Федерального проекта "Бизнес-спринт" (Я выбираю спорт) 
                    национального проекта "Демография". Проект направлен на развитие спортивной инфраструктуры 
                    и популяризацию здорового образа жизни среди населения.
                  </p>
                  <p className="mb-4">
                    Национальный проект "Демография" реализуется с 2019 года и включает комплекс мер по улучшению 
                    демографической ситуации в России, включая развитие физической культуры и спорта.
                  </p>
                  <p className="mb-4">
                    Информационный ресурс создан для информирования пользователей о возможностях спортивного зала, 
                    правилах игр и технике безопасности при занятиях игровыми видами спорта.
                  </p>
                  <p>
                    Проект поддерживает работу на всех типах устройств (компьютеры, планшеты, мобильные телефоны) 
                    и совместим со всеми современными операционными системами, включая российские ОС.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy">
                <AccordionTrigger className="text-xl font-semibold">
                  Политика конфиденциальности
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  <p className="mb-4">
                    Мы серьезно относимся к защите ваших персональных данных. Информация, предоставленная вами 
                    через форму обратной связи, используется исключительно для улучшения качества наших услуг.
                  </p>
                  <p className="mb-4">
                    Мы не передаем ваши данные третьим лицам без вашего согласия. Все данные хранятся в защищенной 
                    среде и обрабатываются в соответствии с законодательством Российской Федерации.
                  </p>
                  <p>
                    Используя наш сервис, вы соглашаетесь с условиями обработки персональных данных.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="partners">
                <AccordionTrigger className="text-xl font-semibold">
                  Условия и требования к партнерам
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  <p className="mb-4">
                    Мы приветствуем сотрудничество с организациями, заинтересованными в развитии спорта и 
                    физической культуры в регионе.
                  </p>
                  <p className="mb-4">
                    Требования к партнерам:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Наличие документов, подтверждающих право на проведение спортивных мероприятий</li>
                    <li>Соблюдение норм безопасности и санитарных требований</li>
                    <li>Наличие квалифицированного персонала</li>
                    <li>Готовность к предоставлению необходимой информации для публикации на ресурсе</li>
                  </ul>
                  <p>
                    По вопросам сотрудничества обращайтесь через форму обратной связи.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contacts" className="pt-4 pb-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Контакты
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" size={24} className="text-primary" />
                    Адрес
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {contacts.address}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Phone" size={24} className="text-primary" />
                    Телефон
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {contacts.phone}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Mail" size={24} className="text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {contacts.email}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={24} className="text-primary" />
                    Режим работы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {contacts.hours}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Map" size={24} className="text-primary" />
                  Как нас найти
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[400px]">
                  <iframe 
                    src="https://yandex.ru/map-widget/v1/?ll=92.869907%2C55.995616&z=17&l=map&pt=92.869907,55.995616,pm2rdm"
                    width="100%" 
                    height="400" 
                    frameBorder="0"
                    allowFullScreen={true}
                    className="border-0"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4 text-center">Поддержка проекта</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm text-center">
                <li>Министерство спорта РФ</li>
                <li>Правительство Красноярского края</li>
              </ul>
              {!isAdmin && (
                <div className="flex justify-center pt-2">
                  <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/30"
                      >
                        <Icon name="Lock" size={16} className="mr-2" />
                        Вход для администратора
                      </Button>
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
                </form>
              </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
          <Separator className="my-6 bg-primary-foreground/20" />
          <div className="text-center text-primary-foreground/80 text-sm space-y-4">
            <p>© 2025 Спортивный зал. Все права защищены.</p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://www.krascsp.ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-foreground underline"
              >
                www.krascsp.ru
              </a>
              <a 
                href="https://vk.com/krascsp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors"
                aria-label="VK"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.785 16.241s.288-.032.436-.193c.136-.148.132-.427.132-.427s-.019-1.304.574-1.496c.584-.19 1.33 1.26 2.124 1.817.6.422 1.056.329 1.056.329l2.126-.03s1.112-.07.585-.962c-.043-.072-.308-.66-1.588-1.87-1.341-1.266-1.161-1.061.454-3.246.984-1.33 1.377-2.143 1.255-2.49-.117-.332-.837-.244-.837-.244l-2.396.015s-.178-.025-.309.056c-.128.079-.21.263-.21.263s-.376 1.018-.877 1.884c-1.057 1.826-1.48 1.924-1.653 1.81-.403-.267-.302-1.074-.302-1.647 0-1.791.266-2.536-.519-2.73-.26-.065-.452-.107-1.119-.114-.857-.009-1.582.003-1.993.208-.273.137-.484.442-.355.459.159.022.519.099.71.364.247.342.238 1.11.238 1.11s.142 2.108-.331 2.37c-.325.18-.77-.187-1.725-1.865-.489-.85-.859-1.79-.859-1.79s-.071-.177-.198-.272c-.154-.114-.37-.15-.37-.15l-2.276.015s-.342.01-.467.161c-.112.134-.009.411-.009.411s1.765 4.208 3.764 6.328c1.833 1.946 3.913 1.817 3.913 1.817h.944z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/krascsp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        contacts={contacts}
        sports={sports}
        onUpdateContacts={setContacts}
        onUpdateSports={setSports}
      />
    </div>
  );
};

export default Index;
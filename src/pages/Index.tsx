import { useState } from 'react';
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

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const { toast } = useToast();

  const sports = [
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
      video: 'https://rutube.ru/play/embed/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
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
      video: 'https://rutube.ru/play/embed/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7'
    }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Спасибо за отзыв!',
      description: 'Ваше сообщение успешно отправлено.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">Спортивный зал "Енисей"</h1>
            <nav className="flex gap-6">
              <a href="#sports" className="hover:underline hidden md:inline">Виды спорта</a>
              <a href="#contacts" className="hover:underline hidden md:inline">Контакты</a>
              <a href="#feedback" className="hover:underline hidden md:inline">Обратная связь</a>
              <a href="#about" className="hover:underline hidden md:inline">О проекте</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-foreground">
              Бизнес-спринт (Я выбираю спорт)
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Устройство спортивного зала выполнено в рамках Федерального проекта "Бизнес-спринт" (Я выбираю спорт) национального проекта "Демография"
            </p>
          </div>
        </div>
      </section>

      <section id="sports" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Классификатор игровых видов спорта
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {sports.map((sport) => (
              <Card key={sport.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={sport.image} 
                    alt={sport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{sport.name}</CardTitle>
                  <CardDescription>Узнайте правила игры и технику безопасности</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedSport(sport.id)}>
                        Подробнее <Icon name="ChevronRight" className="ml-2" size={18} />
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
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Icon name="PlayCircle" size={64} className="text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">Видео-инструкция будет добавлена</p>
                            </div>
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

      <section id="contacts" className="py-16 bg-background">
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
                    г. Красноярск, о. Отдыха, 12
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
                    +7 (391) 123-45-67<br />
                    +7 (391) 123-45-68
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
                    info@sportshall.ru<br />
                    booking@sportshall.ru
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
                    Пн-Пт: 08:00 - 22:00<br />
                    Сб-Вс: 09:00 - 21:00
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
                    src="https://yandex.ru/map-widget/v1/?ll=92.923000%2C56.008500&z=17&l=map&pt=92.923000,56.008500,pm2rdm"
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

      <section id="feedback" className="py-16 bg-primary/5">
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
                    <Input id="name" placeholder="Введите ваше имя" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@mail.ru" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Ваш отзыв или предложение" 
                      rows={5}
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

      <section id="about" className="py-16 bg-background">
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

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Спортивный зал</h3>
              <p className="text-primary-foreground/80">
                Информационный ресурс о спортивных играх
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#sports" className="hover:text-primary-foreground">Виды спорта</a></li>
                <li><a href="#feedback" className="hover:text-primary-foreground">Обратная связь</a></li>
                <li><a href="#about" className="hover:text-primary-foreground">О проекте</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Поддержка проекта</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>Министерство спорта РФ</li>
                <li>Правительство Красноярского края</li>
                <li>Нацпроект «Демография»</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6 bg-primary-foreground/20" />
          <div className="text-center text-primary-foreground/80 text-sm">
            © 2025 Спортивный зал. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
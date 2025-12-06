import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Contacts {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface Partner {
  name: string;
  url: string;
}

interface FooterSectionsProps {
  contacts: Contacts;
  partners?: Partner[];
}

const FooterSections = ({ contacts, partners = [] }: FooterSectionsProps) => {
  return (
    <>
      <section id="about" className="pt-4 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Информация о проекте
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="about">
                <AccordionTrigger className="text-xl font-semibold">
                  <span className="flex-1 text-center md:text-left">О проекте</span>
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
                    и совместим со всеми современными операционными системами, включая Российские ОС.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy">
                <AccordionTrigger className="text-xl font-semibold">
                  <span className="flex-1 text-center md:text-left">Политика конфиденциальности</span>
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
                  <span className="flex-1 text-center md:text-left">Условия и требования к партнерам</span>
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
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4 text-center">Информация</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm text-center">
                <li>
                  <a 
                    href="https://functions.poehali.dev/f86464fd-afbd-480b-a209-1e5d436e180f?type=rules" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground hover:underline transition-all"
                  >
                    Правила посещения
                  </a>
                </li>
                <li>
                  <a 
                    href="https://functions.poehali.dev/f86464fd-afbd-480b-a209-1e5d436e180f?type=prices" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground hover:underline transition-all"
                  >
                    Прейскурант цен
                  </a>
                </li>
                <li>
                  <a 
                    href="https://functions.poehali.dev/f86464fd-afbd-480b-a209-1e5d436e180f?type=benefits" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground hover:underline transition-all"
                  >
                    Перечень льготников
                  </a>
                </li>
                <li>
                  <a 
                    href="https://functions.poehali.dev/f86464fd-afbd-480b-a209-1e5d436e180f?type=schedule" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground hover:underline transition-all"
                  >
                    Расписание
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4 text-center">Наши партнеры</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm text-center">
                {partners.length > 0 ? (
                  partners.map((partner, index) => (
                    <li key={index}>
                      <a 
                        href={partner.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary-foreground hover:underline transition-all"
                      >
                        {partner.name}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-primary-foreground/80">
                    Партнёры не добавлены
                  </span>
                  </li>
                )}
              </ul>
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
    </>
  );
};

export default FooterSections;
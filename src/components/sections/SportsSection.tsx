import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Sport {
  id: string;
  name: string;
  image: string;
  rules: string[];
  safety: string[];
  video: string;
}

interface SportsSectionProps {
  sports: Sport[];
  selectedSport: string | null;
  setSelectedSport: (id: string | null) => void;
}

const SportsSection = ({ sports, selectedSport, setSelectedSport }: SportsSectionProps) => {
  return (
    <>
      <section className="py-8 pb-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-foreground">
              Добро пожаловать в спортивный зал "Енисей"
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Современный спортивный комплекс для занятий игровыми видами спорта. 
              Мы предлагаем качественное покрытие, профессиональное оборудование и комфортные условия для тренировок.
            </p>
          </div>
        </div>
      </section>

      <section id="sports" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Виды спорта
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport) => (
              <Card key={sport.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Trophy" size={24} className="text-primary" />
                    {sport.name}
                  </CardTitle>
                  <CardDescription>
                    Узнайте правила игры и требования безопасности
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={selectedSport === sport.id} onOpenChange={(open) => setSelectedSport(open ? sport.id : null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{sport.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
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
                        
                        <Tabs defaultValue="rules" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="rules">Правила игры</TabsTrigger>
                            <TabsTrigger value="safety">Техника безопасности</TabsTrigger>
                          </TabsList>
                          <TabsContent value="rules" className="space-y-4 mt-4">
                            <div className="bg-primary/5 p-6 rounded-lg">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Icon name="BookOpen" size={20} className="text-primary" />
                                Основные правила
                              </h3>
                              <ul className="space-y-3">
                                {sport.rules.map((rule, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <Icon name="CheckCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{rule}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>
                          <TabsContent value="safety" className="space-y-4 mt-4">
                            <div className="bg-destructive/5 p-6 rounded-lg border border-destructive/20">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Icon name="Shield" size={20} className="text-destructive" />
                                Требования безопасности
                              </h3>
                              <ul className="space-y-3">
                                {sport.safety.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SportsSection;

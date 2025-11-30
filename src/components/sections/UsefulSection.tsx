import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const UsefulSection = () => {
  const trainings = [
    {
      id: 1,
      title: 'Разминка перед тренировкой',
      description: 'Комплекс упражнений для подготовки мышц к нагрузке',
      duration: '10-15 минут',
      icon: 'Activity'
    },
    {
      id: 2,
      title: 'Силовая тренировка',
      description: 'Упражнения для развития силы и выносливости',
      duration: '30-45 минут',
      icon: 'Dumbbell'
    },
    {
      id: 3,
      title: 'Растяжка после тренировки',
      description: 'Упражнения для восстановления и гибкости',
      duration: '10-15 минут',
      icon: 'HeartPulse'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Полезное
          </h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-center">Тренировки</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name={training.icon as any} size={24} className="text-primary" />
                      {training.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Продолжительность: {training.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {training.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsefulSection;

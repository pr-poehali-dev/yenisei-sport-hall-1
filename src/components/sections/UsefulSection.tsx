import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const UsefulSection = () => {
  const trainings = [
    {
      id: 1,
      title: 'Разминка перед тренировкой',
      description: 'Комплекс упражнений для подготовки мышц к нагрузке',
      duration: '10-15 минут',
      icon: 'Activity',
      exercises: [
        'Круговые движения головой - 10 повторений в каждую сторону',
        'Вращение плечами вперед и назад - по 15 повторений',
        'Наклоны корпуса в стороны - по 10 повторений',
        'Вращение тазом - 15 повторений в каждую сторону',
        'Махи ногами вперед-назад - по 10 повторений на каждую ногу',
        'Приседания без веса - 15-20 повторений',
        'Бег на месте с высоким подниманием колен - 30 секунд',
        'Прыжки на месте - 20 повторений'
      ]
    },
    {
      id: 2,
      title: 'Силовая тренировка',
      description: 'Упражнения для развития силы и выносливости',
      duration: '30-45 минут',
      icon: 'Dumbbell',
      exercises: [
        'Отжимания от пола - 3 подхода по 10-15 повторений',
        'Приседания с собственным весом - 3 подхода по 15-20 повторений',
        'Планка - 3 подхода по 30-60 секунд',
        'Выпады вперед - 3 подхода по 10 повторений на каждую ногу',
        'Скручивания на пресс - 3 подхода по 15-20 повторений',
        'Подтягивания или тяга в висе - 3 подхода по 8-12 повторений',
        'Берпи - 3 подхода по 10 повторений',
        'Прыжки со скакалкой - 3 подхода по 1 минуте'
      ]
    },
    {
      id: 3,
      title: 'Растяжка после тренировки',
      description: 'Упражнения для восстановления и гибкости',
      duration: '10-15 минут',
      icon: 'HeartPulse',
      exercises: [
        'Растяжка шеи - наклоны головы в стороны, держать по 15 секунд',
        'Растяжка плеч - заведение руки за голову, держать по 20 секунд',
        'Растяжка грудных мышц - руки в замок за спиной, держать 30 секунд',
        'Наклон к ногам сидя - держать 30-40 секунд',
        'Растяжка квадрицепса - стоя на одной ноге, держать по 30 секунд',
        'Растяжка ягодичных мышц - лежа на спине, держать по 30 секунд',
        'Поза ребенка - держать 40-60 секунд',
        'Скручивания позвоночника лежа - по 30 секунд на каждую сторону'
      ]
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
                    <p className="text-muted-foreground mb-4">
                      {training.description}
                    </p>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="exercises">
                        <AccordionTrigger className="text-sm font-medium">
                          Список упражнений
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {training.exercises.map((exercise, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
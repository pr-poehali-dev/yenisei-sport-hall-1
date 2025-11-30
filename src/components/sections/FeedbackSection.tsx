import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface FeedbackSectionProps {
  handleFeedbackSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  captcha: { num1: number; num2: number; answer: number };
  captchaInput: string;
  setCaptchaInput: (value: string) => void;
}

const FeedbackSection = ({ 
  handleFeedbackSubmit, 
  captcha, 
  captchaInput, 
  setCaptchaInput 
}: FeedbackSectionProps) => {
  return (
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
  );
};

export default FeedbackSection;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FeedbackTabProps {
  feedbackStats: any;
  onRefresh: () => void;
}

export const FeedbackTab = ({ feedbackStats, onRefresh }: FeedbackTabProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const { toast } = useToast();

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read' })
      });
      if (response.ok) {
        toast({
          title: 'Отзыв отмечен как прочитанный',
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const archiveFeedback = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' })
      });
      if (response.ok) {
        toast({
          title: 'Отзыв отправлен в архив',
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось архивировать',
        variant: 'destructive'
      });
    }
  };

  const unarchiveFeedback = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unarchive' })
      });
      if (response.ok) {
        toast({
          title: 'Отзыв восстановлен из архива',
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось восстановить',
        variant: 'destructive'
      });
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/56afe0b0-2d50-4a7c-9498-8cfc3b2df974?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({
          title: 'Отзыв удалён',
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive'
      });
    }
  };

  if (!feedbackStats) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка...</p>
        </CardContent>
      </Card>
    );
  }

  const activeFeedback = feedbackStats?.feedback?.filter((f: any) => !f.is_archived) || [];
  const archivedFeedback = feedbackStats?.feedback?.filter((f: any) => f.is_archived) || [];

  const renderFeedbackCard = (item: any, isArchived: boolean) => (
    <Card key={item.id} className={item.is_read ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {!item.is_read && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
              {item.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Icon name="Mail" size={14} />
                {item.email}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={14} />
                {new Date(item.created_at).toLocaleString('ru-RU')}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!item.is_read && !isArchived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead(item.id)}
                title="Отметить прочитанным"
              >
                <Icon name="Check" size={14} />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <Icon name={expandedId === item.id ? "ChevronUp" : "ChevronDown"} size={14} />
            </Button>
            {!isArchived ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => archiveFeedback(item.id)}
                title="В архив"
              >
                <Icon name="Archive" size={14} />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unarchiveFeedback(item.id)}
                title="Восстановить"
              >
                <Icon name="ArchiveRestore" size={14} />
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteFeedback(item.id)}
              title="Удалить"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      {expandedId === item.id && (
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Сообщение:</Label>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {item.message}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="MessageSquare" size={20} />
              Всего отзывов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{feedbackStats.total_count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="Mail" size={20} />
              Непрочитанных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{feedbackStats.unread_count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="Archive" size={20} />
              В архиве
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">{feedbackStats.archived_count || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'archived')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="active">
              Активные ({activeFeedback.length})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Архив ({archivedFeedback.length})
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>

        <TabsContent value="active" className="space-y-4">
          {activeFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Icon name="Inbox" size={32} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Активных отзывов нет</p>
              </CardContent>
            </Card>
          ) : (
            activeFeedback.map((item: any) => renderFeedbackCard(item, false))
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Icon name="Archive" size={32} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Архив пуст</p>
              </CardContent>
            </Card>
          ) : (
            archivedFeedback.map((item: any) => renderFeedbackCard(item, true))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
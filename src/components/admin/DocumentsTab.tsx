import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface DocumentsTabProps {
  uploadStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'>;
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
}

const documents = [
  { type: 'rules', label: 'Правила посещения', icon: 'FileText' as const },
  { type: 'prices', label: 'Прейскурант цен', icon: 'DollarSign' as const },
  { type: 'benefits', label: 'Перечень льготников', icon: 'Users' as const },
  { type: 'schedule', label: 'Расписание', icon: 'Calendar' as const }
];

export const DocumentsTab = ({ uploadStatus, onDocumentUpload }: DocumentsTabProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon name={doc.icon} size={20} />
              {doc.label}
            </CardTitle>
            <CardDescription>
              Загрузите PDF файл для замены текущего документа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor={`doc-${doc.type}`}>
                Выберите файл (только PDF)
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`doc-${doc.type}`}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => onDocumentUpload(e, doc.type)}
                  disabled={uploadStatus[doc.type] === 'uploading'}
                />
                {uploadStatus[doc.type] === 'uploading' && (
                  <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                )}
                {uploadStatus[doc.type] === 'success' && (
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                )}
                {uploadStatus[doc.type] === 'error' && (
                  <Icon name="XCircle" size={20} className="text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

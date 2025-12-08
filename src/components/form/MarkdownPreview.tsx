import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Copy, Check } from 'lucide-react';

interface MarkdownPreviewProps {
  markdown: string;
  onClose: () => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-hover max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">{t('previewMarkdown')}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <pre className="whitespace-pre-wrap text-sm font-mono bg-secondary rounded-xl p-4 text-foreground">
            {markdown}
          </pre>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-border">
          <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={onClose} className="btn-primary">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

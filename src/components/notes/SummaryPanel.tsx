import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Summary, SummaryLength, SummaryStyle } from '@/lib/types';
import { Sparkles, Loader2, HelpCircle, RefreshCw, Key } from 'lucide-react';

interface SummaryPanelProps {
  noteContent: string;
  summaries: Summary[];
  onSummarize: (length: SummaryLength, style: SummaryStyle) => Promise<void>;
  onExtractKeywords: () => Promise<void>;
  isLoading: boolean;
}

export function SummaryPanel({
  noteContent,
  summaries,
  onSummarize,
  onExtractKeywords,
  isLoading,
}: SummaryPanelProps) {
  const [length, setLength] = useState<SummaryLength>('medium');
  const [style, setStyle] = useState<SummaryStyle>('bullet');
  const [keywordsMode, setKeywordsMode] = useState(false);

  const latestSummary = summaries.find(s => s.type === 'summary');
  const latestKeywords = summaries.find(s => s.type === 'keywords');

  const handleGenerate = async () => {
    if (keywordsMode) {
      await onExtractKeywords();
    } else {
      await onSummarize(length, style);
    }
  };

  const canGenerate = noteContent.trim().length > 50;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-accent-foreground" />
          AI Summarization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-accent">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-accent-foreground" />
            <Label htmlFor="keywords-mode" className="font-medium cursor-pointer">
              Last-Minute Keywords
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Quick revision mode — highlights only the most important keywords.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="keywords-mode"
            checked={keywordsMode}
            onCheckedChange={setKeywordsMode}
          />
        </div>

        {/* Summary Options - Disabled when keywords mode is active */}
        <div className={`space-y-4 transition-opacity ${keywordsMode ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Summary Length */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Summary Length</Label>
            <RadioGroup
              value={length}
              onValueChange={(v) => setLength(v as SummaryLength)}
              className="flex gap-4"
            >
              {(['short', 'medium', 'long'] as const).map((l) => (
                <div key={l} className="flex items-center space-x-2">
                  <RadioGroupItem value={l} id={`length-${l}`} />
                  <Label htmlFor={`length-${l}`} className="capitalize cursor-pointer">
                    {l}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Summary Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Summary Style</Label>
            <RadioGroup
              value={style}
              onValueChange={(v) => setStyle(v as SummaryStyle)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bullet" id="style-bullet" />
                <Label htmlFor="style-bullet" className="cursor-pointer">Bullet Points</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paragraph" id="style-paragraph" />
                <Label htmlFor="style-paragraph" className="cursor-pointer">Paragraph</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !canGenerate}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {keywordsMode ? 'Extracting Keywords...' : 'Generating Summary...'}
            </>
          ) : (
            <>
              {keywordsMode ? (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Extract Keywords
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Summarize
                </>
              )}
            </>
          )}
        </Button>

        {!canGenerate && (
          <p className="text-sm text-muted-foreground text-center">
            Add more content (at least 50 characters) to enable summarization.
          </p>
        )}

        {/* Latest Result */}
        {(keywordsMode ? latestKeywords : latestSummary) && (
          <div className={`p-4 rounded-lg border ${keywordsMode ? 'bg-accent/30 border-accent' : 'bg-secondary/50 border-secondary'}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">
                {keywordsMode ? 'Keywords' : 'Latest Summary'}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            </div>
            <div className={`text-sm ${keywordsMode ? 'font-medium' : ''}`}>
              {(keywordsMode ? latestKeywords : latestSummary)?.content.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Summary History */}
        {summaries.length > 1 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">History</Label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {summaries.slice(1).map((s) => (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border text-xs ${
                    s.type === 'keywords' 
                      ? 'bg-accent/20 border-accent/50' 
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">
                      {s.type === 'keywords' ? '🔑 Keywords' : `📝 ${s.length} • ${s.style}`}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {s.content.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

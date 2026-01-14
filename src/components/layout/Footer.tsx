import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
            <span className="font-semibold">BrieflyAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BrieflyAI. AI-powered note summarization.
          </p>
        </div>
      </div>
    </footer>
  );
}

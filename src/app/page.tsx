import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import {
  Sparkles,
  FileText,
  Zap,
  ArrowRight,
  Key,
  Brain,
  Clock,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-secondary/20" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
              <span>AI-Powered Note Summarization</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Turn Long Notes into
              <span className="block text-primary">Quick Insights</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              BrieflyAI uses advanced AI to summarize your notes instantly.
              Get bullet points, paragraphs, or just the key terms — perfect for studying and quick revision.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your lengthy notes into concise, actionable summaries.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                icon: FileText,
                title: 'Paste Your Notes',
                description: 'Type or paste any long-form content — lecture notes, articles, or research.',
              },
              {
                step: '2',
                icon: Brain,
                title: 'Choose Your Format',
                description: 'Select summary length, style (bullets or paragraph), or extract keywords only.',
              },
              {
                step: '3',
                icon: Zap,
                title: 'Get Instant Results',
                description: 'AI processes your notes and delivers a clean summary in seconds.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    <item.icon className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to organize and understand your notes faster.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: 'Smart Summaries',
                description: 'AI-powered summaries in short, medium, or long formats.',
              },
              {
                icon: Key,
                title: 'Last-Minute Keywords',
                description: 'Extract only the most important terms for quick revision.',
              },
              {
                icon: Clock,
                title: 'Summary History',
                description: 'Keep track of all generated summaries and regenerate anytime.',
              },
              {
                icon: Shield,
                title: 'Private & Secure',
                description: 'Your notes are encrypted and only visible to you.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <feature.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            Ready to Summarize Smarter?
          </h2>
          <p className="mb-8 text-primary-foreground/80 max-w-xl mx-auto">
            Join thousands of students and professionals who save hours every week with BrieflyAI.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
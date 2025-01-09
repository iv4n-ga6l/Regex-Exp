"use client";

import { RegexInput } from '@/components/regex-input';
import { ExamplePatterns } from '@/components/example-patterns';
import { ThemeToggle } from '@/components/theme-toggle';
import { Terminal, Github, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [currentPattern, setCurrentPattern] = useState('');

  const handlePatternSelect = (pattern: string) => {
    setCurrentPattern(pattern);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Terminal className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Regex Exp</h1>
            </div>
            <ThemeToggle />
          </header>

          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Understand Regular Expressions in Natural Language
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform complex regex patterns into clear, human-readable explanations instantly.
              Perfect for developers of all skill levels.
            </p>
          </section>

          {/* Main Input Section */}
          <section className="mb-16">
            <RegexInput initialPattern={currentPattern} />
          </section>

          {/* Examples Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-6">Common Regex Patterns</h3>
            <ExamplePatterns onSelect={handlePatternSelect} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-foreground"
                >
                  NextJS
                </a>
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <a
                href="https://github.com/iv4n-ga6l"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              {/* <a
                href="https://twitter.com/stackblitz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a> */}
              <a
                href="/#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="/#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
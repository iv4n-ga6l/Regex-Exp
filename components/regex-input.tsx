"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { parseRegex } from '@/lib/regex-parser';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface RegexInputProps {
  initialPattern?: string;
}

export function RegexInput({ initialPattern = '' }: RegexInputProps) {
  const [input, setInput] = useState(initialPattern);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialPattern) {
      setInput(initialPattern);
      handleExplain(initialPattern);
    }
  }, [initialPattern]);

  const handleExplain = async (pattern: string = input) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = parseRegex(pattern);
      setExplanation(result.fullDescription);
    } catch (err) {
      setError('Invalid regular expression pattern');
      toast({
        title: "Error",
        description: "Please enter a valid regular expression",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(explanation);
    toast({
      title: "Copied!",
      description: "Explanation copied to clipboard",
    });
  };

  const shareResult = async () => {
    try {
      await navigator.share({
        title: 'Regex Explanation',
        text: `${input}\n\n${explanation}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to share. Try copying instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter your regex pattern..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono"
        />
        <Button 
          onClick={() => handleExplain()}
          disabled={!input || isLoading}
        >
          {isLoading ? "Analyzing..." : "Explain"}
        </Button>
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex justify-between items-start gap-4">
              <p className="text-foreground flex-1">{explanation}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareResult}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
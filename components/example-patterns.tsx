"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const examples = [
  {
    pattern: '^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$',
    title: 'Email Validation',
    description: 'Matches standard email addresses',
  },
  {
    pattern: '^[A-Z]\\d{8}$',
    title: 'ID Number',
    description: 'Matches ID format with 1 letter and 8 digits',
  },
  {
    pattern: '\\d{3}-\\d{2}-\\d{4}',
    title: 'SSN Format',
    description: 'Matches Social Security Number format',
  },
  {
    pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
    title: 'Hex Color',
    description: 'Matches hex color codes with or without #',
  },
  {
    pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
    title: 'Password Strength',
    description: 'Matches passwords with letters and numbers',
  },
];

interface ExamplePatternsProps {
  onSelect: (pattern: string) => void;
}

export function ExamplePatterns({ onSelect }: ExamplePatternsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {examples.map((example, index) => (
        <motion.div
          key={example.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="text-sm font-mono break-all">
                {example.pattern}
              </code>
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => onSelect(example.pattern)}
              >
                Try this pattern
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
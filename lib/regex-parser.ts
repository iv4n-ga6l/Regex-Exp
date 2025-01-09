import { z } from 'zod';

interface RegexComponent {
  type: string;
  value: string;
  description: string;
}

interface ParsedRegex {
  components: RegexComponent[];
  fullDescription: string;
}

// Schema for validation
const regexInputSchema = z.string().min(1).max(1000);

// Helper function to describe quantifiers
function describeQuantifier(quantifier: string): string {
  switch (quantifier) {
    case '*': return 'zero or more times';
    case '+': return 'one or more times';
    case '?': return 'zero or one time';
    default:
      const matches = quantifier.match(/\{(\d+)(?:,(\d+))?\}/);
      if (matches) {
        const [, min, max] = matches;
        if (!max) return `exactly ${min} times`;
        if (max === '') return `${min} or more times`;
        return `between ${min} and ${max} times`;
      }
      return '';
  }
}

// Helper function to describe character classes
function describeCharacterClass(charClass: string): string {
  const predefinedClasses: Record<string, string> = {
    '\\d': 'digit',
    '\\D': 'non-digit',
    '\\w': 'word character',
    '\\W': 'non-word character',
    '\\s': 'whitespace',
    '\\S': 'non-whitespace',
    '.': 'any character',
  };

  if (predefinedClasses[charClass]) {
    return predefinedClasses[charClass];
  }

  // Custom character class
  if (charClass.startsWith('[') && charClass.endsWith(']')) {
    const content = charClass.slice(1, -1);
    const isNegated = content.startsWith('^');
    const actualContent = isNegated ? content.slice(1) : content;

    // Common character class patterns
    if (actualContent === 'a-z') return isNegated ? 'any character except lowercase letters' : 'any lowercase letter';
    if (actualContent === 'A-Z') return isNegated ? 'any character except uppercase letters' : 'any uppercase letter';
    if (actualContent === '0-9') return isNegated ? 'any character except digits' : 'any digit';
    if (actualContent === 'a-zA-Z') return isNegated ? 'any character except letters' : 'any letter';
    if (actualContent === 'a-zA-Z0-9') return isNegated ? 'any character except alphanumeric characters' : 'any alphanumeric character';

    // Custom ranges and characters
    return `${isNegated ? 'any character except' : 'any of these characters:'} ${actualContent}`;
  }

  return charClass;
}

// Helper function to describe anchors and boundaries
function describeAnchor(anchor: string): string {
  const anchors: Record<string, string> = {
    '^': 'start of the line',
    '$': 'end of the line',
    '\\b': 'word boundary',
    '\\B': 'non-word boundary',
  };
  return anchors[anchor] || anchor;
}

// Helper function to describe groups
function describeGroup(group: string, content: string): string {
  if (group.startsWith('(?:')) {
    return `(non-capturing group: ${content})`;
  }
  if (group.startsWith('(?=')) {
    return `(positive lookahead: ${content})`;
  }
  if (group.startsWith('(?!')) {
    return `(negative lookahead: ${content})`;
  }
  if (group.startsWith('(?<=')) {
    return `(positive lookbehind: ${content})`;
  }
  if (group.startsWith('(?<!')) {
    return `(negative lookbehind: ${content})`;
  }
  return `(capturing group: ${content})`;
}

export function parseRegex(pattern: string): ParsedRegex {
  try {
    // Validate input
    regexInputSchema.parse(pattern);
    
    // Validate regex syntax
    new RegExp(pattern);

    const components: RegexComponent[] = [];
    let description = '';

    // Tokenize the regex pattern
    const tokens = pattern.match(/\\[dDwWsSbB]|\[\^?[^\]]*\]|\(\?[:=!<]?[^)]*\)|\{\d+(?:,\d*)?\}|[.*+?^$]|./g) || [];
    
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      let type = 'unknown';
      let value = token;
      let componentDescription = '';

      // Check for quantifiers
      const nextToken = tokens[i + 1];
      const hasQuantifier = nextToken && /^[*+?]|\{\d+(?:,\d*)?\}$/.test(nextToken);

      if (/^[\\[({^$]/.test(token)) {
        // Special characters and groups
        if (token.startsWith('\\')) {
          type = 'predefinedClass';
          componentDescription = describeCharacterClass(token);
        } else if (token.startsWith('[')) {
          type = 'characterClass';
          componentDescription = describeCharacterClass(token);
        } else if (token.startsWith('(')) {
          type = 'group';
          // Find matching closing parenthesis
          let groupContent = '';
          let j = i + 1;
          let depth = 1;
          while (j < tokens.length && depth > 0) {
            if (tokens[j] === '(') depth++;
            if (tokens[j] === ')') depth--;
            if (depth > 0) groupContent += tokens[j];
            j++;
          }
          componentDescription = describeGroup(token, groupContent);
          i = j - 1; // Skip processed tokens
        } else if (token === '^' || token === '$') {
          type = 'anchor';
          componentDescription = describeAnchor(token);
        }
      } else if (/^[*+?{]/.test(token)) {
        type = 'quantifier';
        componentDescription = describeQuantifier(token);
      } else {
        type = 'literal';
        componentDescription = `"${token}"`;
      }

      if (hasQuantifier) {
        componentDescription += ` ${describeQuantifier(nextToken)}`;
        i++; // Skip the quantifier token
      }

      components.push({ type, value, description: componentDescription });
      description += (description ? ' followed by ' : '') + componentDescription;
      i++;
    }

    return {
      components,
      fullDescription: description.trim(),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid input: Pattern is too long or empty');
    }
    throw new Error('Invalid regular expression pattern');
  }
}
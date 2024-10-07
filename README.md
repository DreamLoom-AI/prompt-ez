# prompt-ez

An easy-to-use prompt builder for creating structured prompts in TypeScript.
The goal of this project is to improve prompt readability and maintainability through a simple interface.

## Features

- Structured prompts via tags (converted to XML when built)
- Fluent and chainable API
- Supports nested tags
- Simple methods for text and list insertion
- Dynamic input handling

## Installation

You can install prompt-ez using npm:

```bash
npm install prompt-ez
```

## Usage

Here's an example of how to use the `PromptBuilder` to create a simple prompt:

```typescript
import PromptBuilder from 'prompt-ez';

const prompt = new PromptBuilder()
    .tag('system', (b) => b
        .text('You are a helpful AI assistant.')
        .text('Please provide accurate and concise information.')
    )
    .tag('task', (b) => b
        .text('Summarize the following text:')
        .inputs()
    )
    .tag('output_format', (b) => b
        .text('Provide a summary in bullet points.')
        .list([
            'Use clear and concise language',
            'Keep each bullet point to one sentence',
            'Include only the most important information'
        ])
    )
    .build();

console.log(prompt);
```

This will output the following prompt:

```
<system>
You are a helpful AI assistant.
Please provide accurate and concise information.
</system>
<task>
Summarize the following text:
<inputs>{{INPUTS}}</inputs>
</task>
<output_format>
Provide a summary in bullet points.
1. Use clear and concise language
2. Keep each bullet point to one sentence
3. Include only the most important information
</output_format>
```

### Example 2: Dynamic Inputs

```typescript
const promptWithInputs = new PromptBuilder()
    .tag('system', (b) => b
        .text('You are a language translator.')
    )
    .tag('task', (b) => b
        .text('Translate the following text:')
        .inputs()
    )
    .build({
        source_language: 'English',
        target_language: 'French',
        text: 'Hello, how are you?'
    });

console.log(promptWithInputs);
```

This will output the following prompt:

```
<system>
You are a language translator.
</system>
<task>
Translate the following text:
<source_language>English</source_language>
<target_language>French</target_language>
<text>Hello, how are you?</text>
</task>
```
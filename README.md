# prompt-ez

An easy-to-use prompt builder for creating structured prompts in TypeScript for Large Language Models (LLMs) and AI applications. 

This project aims to improve prompt readability and maintainability through a simple interface, compatible with various AI models from OpenAI, Anthropic, Google Gemini and more.

This is an implementation that was created to meet [DreamLoom's](https://dreamloom.ai) internal needs, but we decided to open-source it since we think it might be useful for others. Please reach out on GitHub if you have suggestions for improvements or other comments.

[Contribute to the project on Github](https://github.com/DreamLoom-AI/prompt-ez)

## Features

- Structured prompts via tags (converted to XML when built)
- Fluent and chainable API
- Supports nested tags
- Simple methods for text and list insertion
- Dynamic input handling
- Optimized for LLM interactions and AI-powered applications
- Compatible with popular AI models from OpenAI, Anthropic, Google Gemini and more
- Follows Anthropic's preferred XML-based prompt structure

## Why XML-based prompts?

This project uses XML-based prompts, which is the preferred structure by Anthropic for their Claude AI model. According to [Anthropic's documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags), using XML tags in prompts can help:

- Clearly separate different parts of the prompt
- Provide structure and context to the AI model
- Improve the model's understanding and response quality

While designed with Anthropic's Claude in mind, this structure can also be beneficial when working with other LLMs and AI models since it allows for a clear and structured approach to prompt engineering.

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
        .text('Explain the benefits of regular exercise.')
    )
    .tag('output_format', (b) => b
        .text('Provide the explanation in a paragraph.')
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
Explain the benefits of regular exercise.
</task>
<output_format>
Provide the explanation in a paragraph.
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

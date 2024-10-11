# prompt-ez

An easy-to-use prompt builder for creating structured prompts in TypeScript for Large Language Models (LLMs) and AI applications.

This project aims to improve prompt readability and maintainability through a simple interface, compatible with various AI models from OpenAI, Anthropic, Google Gemini, and more. It also uses an XML-based prompt structure recommended by Anthropic to improve prompt quality and model understanding.

Originally developed to meet [DreamLoom's](https://dreamloom.ai) internal needs, we've open-sourced it to benefit the wider community. We welcome your suggestions for improvements and other feedback on GitHub.

[Contribute to the project on GitHub](https://github.com/DreamLoom-AI/prompt-ez)

## Features

- Structured prompts using XML-like tags
- Fluent and chainable API for intuitive prompt construction
- Support for nested tags to create complex prompt structures
- Simple methods for text insertion and list creation
- Dynamic input handling for flexible prompt generation
- Optimized for LLM interactions and AI-powered applications
- Compatible with popular AI models including OpenAI, Anthropic, Google Gemini, and others
- Adheres to Anthropic's preferred XML-based prompt structure

## Why XML-based prompts?

This project utilizes XML-based prompts, which is the preferred structure for Anthropic's Claude AI model. According to [Anthropic's documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags), using XML tags in prompts offers several advantages:

- Clear separation of different prompt components
- Enhanced structure and context for the AI model
- Improved model understanding and response quality

While recommended by Anthropic for Claude, this structured approach to prompt engineering can be extremely beneficial when working with other LLMs and AI models as well, helping the models understand and respond better to your prompts, making them more accurate and useful.

## Installation

Install prompt-ez using npm:

  ```bash
  npm install prompt-ez
  ```

## Usage

### PromptBuilder Class

The `PromptBuilder` class is the main interface for creating structured prompts. Here's a quick overview of its methods:

- `tag(name: string, contentFn?: (builder: PromptBuilder) => void): PromptBuilder`
  - Creates an XML-like tag in the prompt.
  - `name`: The name of the tag.
  - `contentFn`: Optional function to add content inside the tag.
  - Returns: The PromptBuilder instance for chaining.

- `text(text: string): PromptBuilder`
  - Adds plain text to the prompt.
  - Returns: The PromptBuilder instance for chaining.

- `list(items: string[]): PromptBuilder`
  - Creates a numbered list in the prompt.
  - Returns: The PromptBuilder instance for chaining.

- `inputs(): PromptBuilder`
  - Adds a placeholder for dynamic inputs.
  - Returns: The PromptBuilder instance for chaining.
- `build(params?: Record<string, unknown>): string`
  - Builds the final prompt string.
  - `params`: Optional object with key-value pairs for dynamic inputs.
    - Supports primitive values (string, number, boolean)
    - Handles arrays and objects by converting them to JSON strings
    - Filters out empty arrays, empty objects, null, undefined, and empty string values
  - Returns: The complete prompt as a string, with dynamic inputs inserted as XML tags.


---

### Example 1: Basic Prompt Creation

Here's a simple example of creating a structured prompt:

  ```typescript
  import PromptBuilder from 'prompt-ez';

  const prompt = new PromptBuilder()
    .tag('system', b => b
      .text('You are a helpful AI assistant.')
      .text('Please provide accurate and concise information.')
    )
    .tag('task', b => b
      .text('Explain the benefits of regular exercise.')
    )
    .tag('output_format', b => b
      .text('Provide the explanation in a paragraph.')
    )
    .build();

  console.log(prompt);
  ```

This generates the following prompt:

  ```xml
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

### Example 2: Using Dynamic Inputs

Here's how to use dynamic inputs in your prompts:

  ```typescript
  const promptWithInputs = new PromptBuilder()
    .tag('system', b => b
      .text('You are a language translator.')
    )
    .tag('task', b => b
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

This produces:

  ```xml
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

### Example 3: Complex Prompt Structure

Here's a more complex example that demonstrates nested tags, list creation, and dynamic inputs:

  ```typescript
  import PromptBuilder from 'prompt-ez';

  export const AI_MEDICAL_DIAGNOSIS_PROMPT = new PromptBuilder()
    .tag('medical_diagnosis_prompt', (builder) => 
      builder
        .tag('role', (b) => b.text('Act as an AI medical assistant. Analyze the provided patient information and suggest three potential diagnoses with recommended next steps.'))
        .inputs()
        .tag('guidelines', (b) => 
          b
            .text('For each potential diagnosis:')
            .list([
              'Consider the patient\'s symptoms, medical history, and test results',
              'Provide a brief explanation of the condition',
              'List key symptoms that align with the diagnosis',
              'Suggest additional tests or examinations if needed',
              'Outline potential treatment options',
              'Indicate the urgency level (e.g., immediate attention, routine follow-up)',
              'Highlight any lifestyle changes or preventive measures',
              'Consider possible complications if left untreated',
              'Use medical terminology appropriately, with layman explanations',
              'Provide a confidence level for each diagnosis (low, medium, high)',
              'First analyze the information thoroughly, then produce the output'
            ])
        )
        .tag('reminder', (b) => b.text('Ensure the diagnoses are evidence-based and consider a range of possibilities from common to rare conditions. Always emphasize the importance of consulting with a human healthcare professional for a definitive diagnosis.'))
        .tag('output_format', (b) => 
          b.list([
            'Present information in a clear, structured manner',
            'Use bullet points for symptoms and recommendations',
            'Include relevant medical terms with brief explanations',
            'Provide a summary of each potential diagnosis',
            'Suggest follow-up questions to gather more information if needed',
            'End with a disclaimer about the limitations of AI diagnosis'
          ])
        )
    )
    .build({
      patient_age: 45,
      patient_gender: 'Female',
      main_symptoms: 'Persistent headache, blurred vision, and occasional dizziness for the past two weeks',
      medical_history: 'Hypertension, controlled with medication',
      recent_tests: 'Blood pressure: 150/95 mmHg, Blood sugar: 110 mg/dL (fasting)'
    });

  console.log(AI_MEDICAL_DIAGNOSIS_PROMPT);
  ```

This will generate a complex, structured prompt for an AI medical diagnosis scenario:

  ```xml
  <medical_diagnosis_prompt>
  <role>Act as an AI medical assistant. Analyze the provided patient information and suggest three potential diagnoses with recommended next steps.</role>
  <patient_age>45</patient_age>
  <patient_gender>Female</patient_gender>
  <main_symptoms>Persistent headache, blurred vision, and occasional dizziness for the past two weeks</main_symptoms>
  <medical_history>Hypertension, controlled with medication</medical_history>
  <recent_tests>Blood pressure: 150/95 mmHg, Blood sugar: 110 mg/dL (fasting)</recent_tests>
  <guidelines>
  For each potential diagnosis:
  1. Consider the patient's symptoms, medical history, and test results
  2. Provide a brief explanation of the condition
  3. List key symptoms that align with the diagnosis
  4. Suggest additional tests or examinations if needed
  5. Outline potential treatment options
  6. Indicate the urgency level (e.g., immediate attention, routine follow-up)
  7. Highlight any lifestyle changes or preventive measures
  8. Consider possible complications if left untreated
  9. Use medical terminology appropriately, with layman explanations
  10. Provide a confidence level for each diagnosis (low, medium, high)
  11. First analyze the information thoroughly, then produce the output
  </guidelines>
  <reminder>Ensure the diagnoses are evidence-based and consider a range of possibilities from common to rare conditions. Always emphasize the importance of consulting with a human healthcare professional for a definitive diagnosis.</reminder>
  <output_format>
  1. Present information in a clear, structured manner
  2. Use bullet points for symptoms and recommendations
  3. Include relevant medical terms with brief explanations
  4. Provide a summary of each potential diagnosis
  5. Suggest follow-up questions to gather more information if needed
  6. End with a disclaimer about the limitations of AI diagnosis
  </output_format>
  </medical_diagnosis_prompt>
  ```

### Advanced Usage

For more advanced usage examples, including nested tags, list creation, and complex prompt structures, please refer to our [documentation](https://github.com/DreamLoom-AI/prompt-ez/wiki).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

prompt-ez is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

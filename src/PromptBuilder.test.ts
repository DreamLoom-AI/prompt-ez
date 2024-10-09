import PromptBuilder from './PromptBuilder';
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('PromptBuilder', () => {
  let builder: PromptBuilder;

  beforeEach(() => {
    builder = new PromptBuilder();
  });

  test('should build a simple prompt with text', () => {
    const result = builder.text('Hello, world!').build();
    expect(result).toBe('Hello, world!');
  });

  test('should build a prompt with tags', () => {
    const result = builder
      .tag('system', (b) => b.text('You are a helpful assistant.'))
      .build();
    expect(result).toBe('<system>\nYou are a helpful assistant.\n</system>');
  });

  test('should build a prompt with nested tags', () => {
    const result = builder
      .tag('outer', (b) =>
        b.text('Outer content').tag('inner', (b) => b.text('Inner content'))
      )
      .build();
    expect(result).toBe('<outer>\nOuter content\n<inner>\nInner content\n</inner>\n</outer>');
  });

  test('should build a prompt with a list', () => {
    const result = builder
      .text('Here is a list:')
      .list(['Item 1', 'Item 2', 'Item 3'])
      .build();
    expect(result).toBe('Here is a list:\n1. Item 1\n2. Item 2\n3. Item 3');
  });

  test('should build a prompt with inputs', () => {
    const result = builder
      .text('Here are some inputs:')
      .inputs()
      .build({ name: 'John', age: 30 });
    expect(result).toBe('Here are some inputs:\n<name>John</name>\n<age>30</age>');
  });

  test('should handle empty or undefined inputs', () => {
    const result = builder
      .text('Here are some inputs:')
      .inputs()
      .build({ name: 'John', empty: '', nullValue: null, undefinedValue: undefined });
    expect(result).toBe('Here are some inputs:\n<name>John</name>');
  });

  test('should handle array and object inputs', () => {
    const result = builder
      .text('Here are some inputs:')
      .inputs()
      .build({
        array: [1, 2, 3],
        object: { a: 1, b: 2 },
        emptyArray: [],
        emptyObject: {},
      });
    expect(result).toBe(
      'Here are some inputs:\n<array>[1,2,3]</array>\n<object>{"a":1,"b":2}</object>'
    );
  });

  test('should build a complex prompt', () => {
    const result = builder
      .tag('system', (b) => b.text('You are a helpful assistant.'))
      .tag('user', (b) =>
        b
          .text('Please provide information about:')
          .list(['The weather', 'Current events'])
          .inputs()
      )
      .build({ location: 'New York', date: '2023-04-14' });

    expect(result).toBe(
      '<system>\nYou are a helpful assistant.\n</system>\n' +
      '<user>\nPlease provide information about:\n' +
      '1. The weather\n2. Current events\n' +
      '<location>New York</location>\n<date>2023-04-14</date>\n' +
      '</user>'
    );
  });
});
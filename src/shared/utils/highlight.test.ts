import { describe, it, expect } from 'vitest';
import { highlightCaseInsensitive } from './highlight';

describe('highlightCaseInsensitive', () => {
  it('highlights a matching substring', () => {
    const text = 'text';
    const query = 'te';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('<mark>te</mark>xt');
  });

  it('highlights a matching substring and escapes HTML', () => {
    const text = '<div>text</div>';
    const query = 'te';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('&lt;div&gt;<mark>te</mark>xt&lt;/div&gt;');
  });

  it('highlights every matching substring', () => {
    const text = 'text text';
    const query = 'te';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('<mark>te</mark>xt <mark>te</mark>xt');
  });

  it('highlights full string', () => {
    const text = 'text';
    const query = 'text';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('<mark>text</mark>');
  });

  it('highlights full string and escapes HTML', () => {
    const text = '<div>text</div>';
    const query = 'text';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('&lt;div&gt;<mark>text</mark>&lt;/div&gt;');
  });

  it('returns source text when query is empty', () => {
    const text = 'text';
    const query = '';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('text');
  });

  it('returns escaped text when query is empty', () => {
    const text = '<div>text</div>';
    const query = '';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('&lt;div&gt;text&lt;/div&gt;');
  });

  it('highlights substring case insensitively', () => {
    const text = 'Learn React';
    const query = 'react';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('Learn <mark>React</mark>');
  });

  it('highlights regex metacharacters', () => {
    const text = 'file.test';
    const query = '.';

    const result = highlightCaseInsensitive(text, query);

    expect(result).toBe('file<mark>.</mark>test');
  });
});

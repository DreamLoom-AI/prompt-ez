class PromptBuilder {
    private readonly content: string[] = [];
    private inputsPlaceholder: string = '';

    public tag(name: string, contentFn?: (builder: PromptBuilder) => void): PromptBuilder {
        this.content.push(`<${name}>`);
        contentFn?.(this);
        this.content.push(`</${name}>`);
        return this;
    }

    public text(text: string): PromptBuilder {
        this.content.push(text);
        return this;
    }

    public list(items: string[]): PromptBuilder {
        this.content.push(...items.map((item, index) => `${index + 1}. ${item}`));
        return this;
    }

    public inputs(): PromptBuilder {
        this.inputsPlaceholder = '<inputs>{{INPUTS}}</inputs>';
        this.content.push(this.inputsPlaceholder);
        return this;
    }

    public build(params?: Record<string, unknown>): string {
        let result = this.content.join('\n');
        
        if (params) {
            const inputsString = Object.entries(params)
                .filter(([_, value]) => {
                    if (Array.isArray(value)) {
                        return value.length > 0;
                    }
                    if (typeof value === 'object' && value !== null) {
                        return Object.keys(value).length > 0;
                    }
                    return value !== undefined && value !== null && value !== '';
                })
                .map(([key, value]) => {
                    let stringValue: string;
                    if (Array.isArray(value) || typeof value === 'object') {
                        stringValue = JSON.stringify(value);
                    } else {
                        stringValue = String(value);
                    }
                    return `<${key}>${stringValue}</${key}>`;
                })
                .join('\n');
            result = result.replace(this.inputsPlaceholder, inputsString);
        } else {
            result = result.replace(this.inputsPlaceholder, '');
        }
        
        return result;
    }
}

export default PromptBuilder;
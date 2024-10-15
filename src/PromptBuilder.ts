class PromptBuilder {
    private readonly content: string[] = [];
    private inputsPlaceholder: string = '';
    private hasInputs: boolean = false;

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
        this.hasInputs = true;
        return this;
    }

    public build(params?: Record<string, unknown>): string {
        if (params && !this.hasInputs) {
            throw new Error('Inputs were provided but inputs() was not called in the prompt builder.');
        }

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
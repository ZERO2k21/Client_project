// Sample JavaScript file to test CognaAI complexity analysis
// This file contains various complexity scenarios for demonstration

class ComplexDataProcessor {
    constructor() {
        this.data = [];
        this.config = {
            maxDepth: 10,
            threshold: 0.5,
            enableValidation: true
        };
    }

    // High complexity function - demonstrates multiple complexity issues
    processComplexData(input, options = {}) {
        // Nested conditionals and loops increase complexity
        if (input && input.length > 0) {
            for (let i = 0; i < input.length; i++) {
                const item = input[i];
                
                if (item.type === 'primary') {
                    if (item.value > this.config.threshold) {
                        if (options.strict) {
                            if (this.config.enableValidation) {
                                for (let j = 0; j < item.children.length; j++) {
                                    const child = item.children[j];
                                    
                                    if (child.status === 'active') {
                                        switch (child.category) {
                                            case 'A':
                                                if (child.priority > 5) {
                                                    this.handleHighPriority(child);
                                                } else {
                                                    this.handleLowPriority(child);
                                                }
                                                break;
                                            case 'B':
                                                if (child.metadata && child.metadata.urgent) {
                                                    this.handleUrgent(child);
                                                } else {
                                                    this.handleNormal(child);
                                                }
                                                break;
                                            case 'C':
                                                for (let k = 0; k < child.tags.length; k++) {
                                                    if (child.tags[k].includes('critical')) {
                                                        this.processCritical(child, k);
                                                    }
                                                }
                                                break;
                                            default:
                                                this.handleDefault(child);
                                        }
                                    }
                                }
                            }
                        } else {
                            this.processNormalItem(item);
                        }
                    }
                } else if (item.type === 'secondary') {
                    this.processSecondaryItem(item);
                } else {
                    this.processUnknownItem(item);
                }
            }
        }
        
        return this.finalizeProcessing();
    }

    // Medium complexity function
    validateInput(data) {
        if (!data) {
            throw new Error('Data is required');
        }

        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        if (!Array.isArray(data.items)) {
            throw new Error('Items must be an array');
        }

        for (const item of data.items) {
            if (!item.id) {
                throw new Error('Each item must have an id');
            }
            
            if (item.type && !['primary', 'secondary', 'tertiary'].includes(item.type)) {
                throw new Error('Invalid item type');
            }
        }

        return true;
    }

    // Low complexity functions
    handleHighPriority(item) {
        this.data.push({ ...item, processed: true, priority: 'high' });
    }

    handleLowPriority(item) {
        this.data.push({ ...item, processed: true, priority: 'low' });
    }

    handleUrgent(item) {
        console.log('Processing urgent item:', item.id);
        this.data.unshift(item);
    }

    handleNormal(item) {
        this.data.push(item);
    }

    processCritical(item, index) {
        console.log(`Critical processing for item ${item.id} at index ${index}`);
        this.data.splice(0, 0, { ...item, critical: true });
    }

    handleDefault(item) {
        console.log('Default handling for:', item.id);
        this.data.push(item);
    }

    processNormalItem(item) {
        this.data.push({ ...item, type: 'normal' });
    }

    processSecondaryItem(item) {
        this.data.push({ ...item, type: 'secondary', processed: true });
    }

    processUnknownItem(item) {
        console.warn('Unknown item type:', item.type);
        this.data.push({ ...item, type: 'unknown' });
    }

    finalizeProcessing() {
        return {
            processed: this.data.length,
            data: this.data
        };
    }
}

// Export for use
export default ComplexDataProcessor;

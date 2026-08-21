import registry from './animationRegistry';

/**
 * Utility to bridge external datasets like MS-ASL into the toolkit.
 * This can be used to load batch animation data from JSON/external sources.
 */
class DatasetBridge {
    /**
     * Loads a batch of signs from a JSON structure.
     * Expected format: { "WORD": [[bone, action, axis, limit, sign], ...] }
     */
    async loadDataset(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            const data = await response.json();

            Object.keys(data).forEach(word => {
                const animationData = data[word];
                this.registerAnimation(word, animationData);
            });

            console.log(`Loaded ${Object.keys(data).length} signs from ${jsonUrl}`);
        } catch (error) {
            console.error("Failed to load dataset:", error);
        }
    }

    /**
     * Dynamically registers a new animation function.
     */
    registerAnimation(word, sequences) {
        const animationFunc = (ref) => {
            sequences.forEach(step => {
                // Ensure the step is an array to match the ref.animations format
                ref.animations.push(step);
            });

            if (ref.pending === false) {
                ref.pending = true;
                ref.animate();
            }
        };

        // Inject into registry
        registry.cache.set(word.toUpperCase(), animationFunc);
    }
}

const bridge = new DatasetBridge();
export default bridge;

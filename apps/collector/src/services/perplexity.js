import { config } from '@packages/config';
async function getLatestPosts(profileName) {
    const url = 'https://api.perplexity.ai/v1/search';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.perplexityApiKey}`
        },
        body: JSON.stringify({
            query: `latest posts from ${profileName} on twitter`,
            max_results: 5
        })
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching from Perplexity API:', error);
        throw error;
    }
}
export const perplexityClient = {
    getLatestPosts,
};
//# sourceMappingURL=perplexity.js.map
// Fetch Open Graph preview data for a given URL using a public API (Microlink)
// You may want to use your own API key or proxy for production use

export interface LinkPreview {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    error?: string;
}

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
    try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.status === 'success') {
            return {
                url,
                title: data.data.title,
                description: data.data.description,
                image: data.data.image?.url,
                siteName: data.data.publisher,
            };
        } else {
            return { url, error: 'No preview available' };
        }
    } catch (e) {
        return { url, error: 'Failed to fetch preview' };
    }
}

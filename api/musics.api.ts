import { z } from 'zod';
import { API_BASE_URL } from ".";
import { musicSchema } from './music.api';

const BASE_URL = `${API_BASE_URL}/musics`;

const musicsSchema = z.array(musicSchema);

export async function getMusics() {

    try {

        const resp = await fetch(BASE_URL);

        const { data } = await resp.json();

        switch (resp.status) {
            case 200:
                return musicsSchema.parse(data);

            default:
                throw new Error(data.error);
        }

    } catch (error) {
        throw error;
    }

}

const videoItemSchema = z.object({
    id: z.object({
        videoId: z.string()
    }),
    snippet: z.object({
        publishedAt: z.string(),
        channelId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnails: z.object({
            high: z.object({
                url: z.string().url()
            })
        }),
        channelTitle: z.string(),
    }),
});

export type Video = z.infer<typeof videoItemSchema>;

// Updated schema without pageInfo dependency
export const searchResponseSchema = z.object({
    items: z.array(videoItemSchema),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export async function searchVideos(q: string): Promise<SearchResponse> {
    try {

        const urlInURL = new URL(`${BASE_URL}/search`);
        urlInURL.searchParams.set('q', q);

        const resp = await fetch(urlInURL);
        const { data, error } = await resp.json();

        switch (resp.status) {
            case 200:
                return searchResponseSchema.parse(data);
            default:
                throw new Error(error);
        }
    } catch (error) {
        console.error('Search API error:', error);
        throw error;
    }
}
import { z } from 'zod';
import { API_BASE_URL } from ".";

const BASE_URL = `${API_BASE_URL}/musics`;

const musicSchema = z.object({
    id: z.string(),
    snippet: z.object({
        title: z.string(),
        thumbnails: z.object({
            standard: z.object({
                url: z.string().url(),
                width: z.number(),
                height: z.number(),
            })
        }),
        channelTitle: z.string()
    }),
    streamUri: z.string().url()
})

const MUSIC_FIELD = 'id, snippet.title, snippet.thumbnails.standard, snippet.channelTitle, streamUri, contentDetails';

export async function getMusicById(id: string) {

    try {

        const resp = await fetch(`${BASE_URL}/tracks/${id}?fields=${MUSIC_FIELD}`);

        const { data } = await resp.json();

        switch (resp.status) {
            case 200:
                return musicSchema.parse(data);

            default:
                throw new Error(data.error);
        }

    } catch (error) {
        throw error;
    }

}
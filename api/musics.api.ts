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
import { getMusicById } from '@/api/music.api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function useGetMusic() {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;

    return useSuspenseQuery({
        queryKey: ["musics", id],
        queryFn: () => getMusicById(id),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
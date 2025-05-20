
export function NextMusicsSkeletonLoading() {
    return (
        <div className="animate-pulse">
            {new Array(20).fill(0).map((_, index) => (
                <div key={index} className="flex items-center rounded-md justify-between py-2 px-3 border-b w-full border-b-muted/50">
                    {/* Thumbnail and music info */}
                    <div className="gap-3 flex items-center">
                        {/* Skeleton thumbnail */}
                        <div className="bg-muted-foreground/20 w-[55px] h-[55px] rounded" />

                        <div>
                            {/* Skeleton title */}
                            <div className="h-4 w-48 bg-muted-foreground/20 rounded mb-2" />
                            {/* Skeleton channel name */}
                            <div className="h-3 w-28 bg-muted-foreground/20 rounded" />
                        </div>
                    </div>

                    {/* Skeleton duration */}
                    <div className="h-3 w-8 bg-muted-foreground/20 rounded" />
                </div>
            ))}
        </div>
    )
}
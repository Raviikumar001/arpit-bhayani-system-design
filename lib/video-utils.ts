import { Video, LinksData, DifficultyLevel, ContentType } from "@/types";
import rawLinks from "@/data/links.json";

const linksData = (rawLinks as unknown) as LinksData[];

export const getYouTubeId = (url: string): string | undefined => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : undefined;
};

export const getAllVideos = (): Video[] => {
    const videos: Video[] = [];

    linksData.forEach((data) => {
        // Technical Levels
        if (data.levels) {
            Object.values(data.levels).forEach((list: Video[]) => {
                list.forEach((v: Video) => {
                    videos.push({
                        ...v,
                        videoId: getYouTubeId(v.url),
                        id: getYouTubeId(v.url)
                    });
                });
            });
        }

        // Motivational
        if (data.motivation_and_soft_advice) {
            data.motivation_and_soft_advice.forEach((v: Video) => {
                videos.push({
                    ...v,
                    videoId: getYouTubeId(v.url),
                    id: getYouTubeId(v.url)
                });
            });
        }
    });

    return videos;
};

export const getVideoById = (id: string): Video | undefined => {
    const allVideos = getAllVideos();
    return allVideos.find(v => v.id === id);
}

export const getVideosByCategory = (type: ContentType, level?: DifficultyLevel): Video[] => {
    const videos: Video[] = [];

    linksData.forEach(data => {
        if (type === 'technical' && data.levels) {
            if (level && data.levels[level]) {
                videos.push(...data.levels[level].map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            } else if (!level) {
                // All technical levels
                Object.values(data.levels).forEach((list: Video[]) => {
                    videos.push(...list.map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
                })
            }
        }
        else if (type === 'motivational') {
            // Ignores level for motivational now as it is a flat list
            if (data.motivation_and_soft_advice) {
                videos.push(...data.motivation_and_soft_advice.map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            }
        }
    });
    return videos;
}

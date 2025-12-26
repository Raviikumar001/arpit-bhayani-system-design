import { Video, CourseData, DifficultyLevel, ContentType } from "@/types";
import rawLinks from "@/data/links.json";

// Force cast the raw JSON to our typed interface
const linksData = (rawLinks as unknown) as CourseData[];

export const getYouTubeId = (url: string): string | undefined => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : undefined;
};

export const getAllVideos = (): Video[] => {
    const videos: Video[] = [];

    // We assume the links.json structure is an array, usually with one main object for the channel
    linksData.forEach((channelData) => {
        // Technical
        if (channelData.categories.technical) {
            Object.entries(channelData.categories.technical).forEach(([level, videoList]) => {
                videoList.forEach(v => {
                    videos.push({
                        ...v,
                        videoId: getYouTubeId(v.url),
                        id: getYouTubeId(v.url) // Use Youtube ID as the unique ID
                    })
                })
            });
        }
        // Motivational
        if (channelData.categories.motivational) {
            Object.entries(channelData.categories.motivational).forEach(([level, videoList]) => {
                if (videoList) {
                    videoList.forEach(v => {
                        videos.push({
                            ...v,
                            videoId: getYouTubeId(v.url),
                            id: getYouTubeId(v.url)
                        })
                    })
                }
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
    linksData.forEach(channelData => {
        if (type === 'technical' && channelData.categories.technical) {
            if (level && channelData.categories.technical[level]) {
                videos.push(...channelData.categories.technical[level].map(v => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            } else if (!level) {
                // All technical
                Object.values(channelData.categories.technical).forEach(list => {
                    videos.push(...list.map(v => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
                })
            }
        }
        else if (type === 'motivational' && channelData.categories.motivational) {
            // For motivational, the structure might be simpler or mapped differently
            // For now assuming similar structure
            if (level && (channelData.categories.motivational as any)[level]) {
                videos.push(...(channelData.categories.motivational as any)[level].map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            } else if (!level) {
                // All motivational
                Object.values(channelData.categories.motivational).forEach(list => {
                    if (list) videos.push(...list.map(v => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
                })
            }
        }
    });
    return videos;
}

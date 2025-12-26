import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { Progress, Note } from '@/types';

interface StoreState {
    progress: Record<string, Progress>; // Keyed by videoId
    notes: Record<string, Note>;       // Keyed by videoId (assuming 1 note per video for simplicity)

    // Actions
    markCompleted: (videoId: string, completed: boolean) => Promise<void>;
    updateProgress: (videoId: string, timestamp: number) => Promise<void>;
    saveNote: (videoId: string, content: string) => Promise<void>;
    loadData: () => Promise<void>;
}

export const useStore = create<StoreState>((setState, getStore) => ({
    progress: {},
    notes: {},

    markCompleted: async (videoId, completed) => {
        const newProgress = {
            ...getStore().progress[videoId],
            videoId,
            completed,
            lastWatchedAt: Date.now(),
        };

        setState((state) => ({
            progress: { ...state.progress, [videoId]: newProgress },
        }));

        // Persist to IDB
        await set('progress', getStore().progress);
    },

    updateProgress: async (videoId, timestamp) => {
        // Don't overwrite 'completed' status if it was already true
        const current = getStore().progress[videoId];
        const newProgress = {
            videoId,
            completed: current?.completed || false,
            lastWatchedAt: timestamp
        };

        setState((state) => ({
            progress: { ...state.progress, [videoId]: newProgress }
        }));

        // Debounce persistence in a real app, but for now direct save
        await set('progress', getStore().progress);
    },

    saveNote: async (videoId, content) => {
        const newNote: Note = {
            id: videoId, // One note per video
            videoId,
            content,
            createdAt: getStore().notes[videoId]?.createdAt || Date.now(),
            updatedAt: Date.now()
        };

        setState((state) => ({
            notes: { ...state.notes, [videoId]: newNote }
        }));

        await set('notes', getStore().notes);
    },

    loadData: async () => {
        const progress = (await get('progress')) || {};
        const notes = (await get('notes')) || {};
        setState({ progress, notes });
    }
}));

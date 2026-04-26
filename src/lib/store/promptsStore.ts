import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  Collection,
  Prompt,
  PromptFilters,
  PromptStore,
  PromptStoreState,
} from "@/lib/types/promptTypes";

const STORAGE_KEY = "promtforge-state-v1";

type PersistedState = Pick<PromptStoreState, "prompts" | "collections" | "filters">;

const defaultFilters: PromptFilters = {
  search: "",
  tags: [],
  collectionId: undefined,
  favoritesOnly: false,
};

const getInitialState = (): PromptStoreState => ({
  prompts: [],
  collections: [],
  selectedPromptId: undefined,
  filters: defaultFilters,
  initialized: false,
});

const loadFromStorage = (): PersistedState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || !Array.isArray(parsed.prompts) || !Array.isArray(parsed.collections)) {
      return null;
    }

    return {
      prompts: parsed.prompts,
      collections: parsed.collections,
      filters: parsed.filters ?? defaultFilters,
    };
  } catch {
    return null;
  }
};

const saveToStorage = (state: PersistedState) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (quota, disabled, etc.)
  }
};

export const usePromptsStore = create<PromptStore>((set, get) => ({
  ...getInitialState(),

  initFromStorage: () => {
    if (get().initialized) return;
    const persisted = loadFromStorage();

    if (persisted) {
      set({
        prompts: persisted.prompts,
        collections: persisted.collections,
        filters: persisted.filters,
        initialized: true,
      });
    } else {
      set({ initialized: true });
    }
  },

  addPrompt: (data) => {
    const now = new Date().toISOString();
    const newPrompt: Prompt = {
      id: nanoid(),
      favorite: false,
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    set((state) => {
      const prompts = [...state.prompts, newPrompt];
      saveToStorage({ prompts, collections: state.collections, filters: state.filters });
      return { prompts, selectedPromptId: newPrompt.id };
    });
  },

  updatePrompt: (id, updates) => {
    set((state) => {
      const prompts = state.prompts.map((prompt) =>
        prompt.id === id
          ? {
              ...prompt,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : prompt,
      );
      saveToStorage({ prompts, collections: state.collections, filters: state.filters });
      return { prompts };
    });
  },

  deletePrompt: (id) => {
    set((state) => {
      const prompts = state.prompts.filter((prompt) => prompt.id !== id);
      const selectedPromptId = state.selectedPromptId === id ? undefined : state.selectedPromptId;
      saveToStorage({ prompts, collections: state.collections, filters: state.filters });
      return { prompts, selectedPromptId };
    });
  },

  duplicatePrompt: (id) => {
    const source = get().prompts.find((prompt) => prompt.id === id);
    if (!source) return;

    const now = new Date().toISOString();
    const duplicate: Prompt = {
      ...source,
      id: nanoid(),
      title: `${source.title} (Copy)`,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const prompts = [...state.prompts, duplicate];
      saveToStorage({ prompts, collections: state.collections, filters: state.filters });
      return { prompts, selectedPromptId: duplicate.id };
    });
  },

  addCollection: (data) => {
    const collection: Collection = {
      id: nanoid(),
      ...data,
    };

    set((state) => {
      const collections = [...state.collections, collection];
      saveToStorage({ prompts: state.prompts, collections, filters: state.filters });
      return { collections };
    });
  },

  updateCollection: (id, updates) => {
    set((state) => {
      const collections = state.collections.map((collection) =>
        collection.id === id ? { ...collection, ...updates } : collection,
      );
      saveToStorage({ prompts: state.prompts, collections, filters: state.filters });
      return { collections };
    });
  },

  deleteCollection: (id) => {
    set((state) => {
      const collections = state.collections.filter((collection) => collection.id !== id);
      const prompts = state.prompts.map((prompt) =>
        prompt.collectionId === id ? { ...prompt, collectionId: undefined } : prompt,
      );

      const filters: PromptFilters = {
        ...state.filters,
        collectionId: state.filters.collectionId === id ? undefined : state.filters.collectionId,
      };

      saveToStorage({ prompts, collections, filters });
      return { collections, prompts, filters };
    });
  },

  toggleFavorite: (id) => {
    set((state) => {
      const prompts = state.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, favorite: !prompt.favorite, updatedAt: new Date().toISOString() } : prompt,
      );
      saveToStorage({ prompts, collections: state.collections, filters: state.filters });
      return { prompts };
    });
  },

  setFilters: (partialFilters) => {
    set((state) => {
      const filters: PromptFilters = { ...state.filters, ...partialFilters };
      saveToStorage({ prompts: state.prompts, collections: state.collections, filters });
      return { filters };
    });
  },

  selectPrompt: (id) => {
    set({ selectedPromptId: id });
  },
}));



export type PromptVariable = {
  name: string;
  description?: string;
  defaultValue?: string;
};

export type Prompt = {
  id: string;
  title: string;
  description?: string;
  body: string;
  tags: string[];
  collectionId?: string;
  model?: string;
  language?: string;
  variables?: PromptVariable[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  color?: string;
};

export type PromptFilters = {
  search: string;
  tags: string[];
  collectionId?: string;
  favoritesOnly: boolean;
};

export type PromptStoreState = {
  prompts: Prompt[];
  collections: Collection[];
  selectedPromptId?: string;
  filters: PromptFilters;
  initialized: boolean;
};

export type PromptStoreActions = {
  initFromStorage: () => void;
  addPrompt: (data: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void;
  updatePrompt: (id: string, updates: Partial<Omit<Prompt, "id" | "createdAt">>) => void;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => void;
  addCollection: (data: Omit<Collection, "id">) => void;
  updateCollection: (id: string, updates: Partial<Omit<Collection, "id">>) => void;
  deleteCollection: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilters: (filters: Partial<PromptFilters>) => void;
  selectPrompt: (id: string | undefined) => void;
};

export type PromptStore = PromptStoreState & PromptStoreActions;



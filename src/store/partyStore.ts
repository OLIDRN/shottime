import { create } from 'zustand';

export type Party = {
  code: string;
  players: string[];
};

interface PartyStore {
  parties: Party[];
  createParty: (code: string, host: string) => void;
  joinParty: (code: string, pseudo: string) => { success: boolean; error?: string };
  getParty: (code: string) => Party | undefined;
}

export const usePartyStore = create<PartyStore>((set, get) => ({
  parties: [],
  createParty: (code, host) =>
    set((state) => ({
      parties: [...state.parties, { code, players: [host] }],
    })),
  joinParty: (code, pseudo) => {
    const party = get().parties.find((p) => p.code === code);
    if (!party) return { success: false, error: 'Code de session invalide.' };
    if (party.players.includes(pseudo)) return { success: false, error: 'Pseudo déjà pris dans cette partie.' };
    party.players.push(pseudo);
    set((state) => ({ parties: [...state.parties] }));
    return { success: true };
  },
  getParty: (code) => get().parties.find((p) => p.code === code),
})); 
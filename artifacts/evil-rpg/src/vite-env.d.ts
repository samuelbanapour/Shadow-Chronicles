/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ACH_GAME_START?: string;
  readonly VITE_ACH_CHAPTER_2?: string;
  readonly VITE_ACH_CHAPTER_3?: string;
  readonly VITE_ACH_CHAPTER_4?: string;
  readonly VITE_ACH_ENDING_BAD?: string;
  readonly VITE_ACH_ENDING_NEUTRAL?: string;
  readonly VITE_ACH_ENDING_DARK_TRIUMPH?: string;
  readonly VITE_ACH_ENDING_TRUE_EVIL?: string;
  readonly VITE_ACH_ENDING_REDEMPTION?: string;
  readonly VITE_ACH_CORRUPTION_50?: string;
  readonly VITE_ACH_CORRUPTION_80?: string;
  readonly VITE_ACH_CLASS_SHADOWBLADE?: string;
  readonly VITE_ACH_CLASS_NECROMANCER?: string;
  readonly VITE_ACH_CLASS_WARLORD?: string;
  readonly VITE_ACH_CLASS_PLAGUE_DOCTOR?: string;
  readonly VITE_ACH_LEVEL_5?: string;
  readonly VITE_ACH_ALL_CLASSES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

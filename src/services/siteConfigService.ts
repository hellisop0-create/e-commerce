import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storyDescription: string;
  storyImage: string;
}

const CONFIG_COLLECTION = 'siteConfig';
const HOME_DOC = 'home';

const DEFAULT_CONFIG: SiteConfig = {
  heroTitle: 'Pre-Loved Vintage',
  heroSubtitle: 'Sustainable style for the digital age. Every piece hand-picked, washed, and ready for a new chapter.',
  heroImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop',
  storyTitle: "Not Just Gear. It's History.",
  storyDescription: "KAAM25 was born from a desire to preserve the craftsmanship of the past. We don't just sell clothes; we curate pieces of history that have stood the test of time.",
  storyImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop'
};

export const siteConfigService = {
  async getConfig(): Promise<SiteConfig> {
    try {
      const docRef = doc(db, CONFIG_COLLECTION, HOME_DOC);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...DEFAULT_CONFIG, ...snap.data() } as SiteConfig;
      }
      return DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error getting site config:', error);
      return DEFAULT_CONFIG;
    }
  },

  async updateConfig(data: Partial<SiteConfig>): Promise<void> {
    try {
      const docRef = doc(db, CONFIG_COLLECTION, HOME_DOC);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, data);
      } else {
        await setDoc(docRef, { ...DEFAULT_CONFIG, ...data });
      }
    } catch (error) {
      console.error('Error updating site config:', error);
      throw error;
    }
  }
};

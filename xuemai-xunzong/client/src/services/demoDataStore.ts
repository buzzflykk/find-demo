export const LOCAL_PUBLISHED_KEY = 'timeprint_demo_published_missing_v1';
export const LOCAL_MESSAGES_KEY = 'timeprint_demo_messages_v1';

export type DemoMissingItem = {
  id: string;
  user_id?: string;
  userId?: string;
  title: string;
  photos: string[] | string;
  letters?: string[] | string;
  text_only?: string;
  ai_keywords?: any[];
  target_name: string;
  target_nickname?: string;
  lost_time?: string;
  lost_location: string;
  lost_type: string;
  description?: string;
  poster_image?: string;
  status?: string;
  view_count: number;
  match_count: number;
  created_at: string;
  scenario_tags?: string[];
};

export type DemoMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  msg_type: string;
  image_url: string;
  is_read: number;
  created_at: string;
};

export type DemoMessageStore = Record<string, DemoMessage[]>;

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function normalizePhotos(photos: unknown): string[] {
  if (Array.isArray(photos)) return photos.filter(Boolean).map(String);
  if (typeof photos === 'string') return safeJsonParse<string[]>(photos, []);
  return [];
}

export function inferScenarioTags(text: string) {
  const tags = new Set<string>();
  if (/旧友|朋友|同学|邻居|阿姨|叔|失联|联系/.test(text)) tags.add('old-friend');
  if (/宠物|狗|狗狗|走失|项圈/.test(text)) tags.add('pet-dog');
  if (/同学|小学|毕业|班|学校/.test(text)) tags.add('classmate');
  if (/旧信|信件|明信片|邮箱|地址|信/.test(text)) tags.add('letter');
  if (/搬家|拆迁|迁走|搬走/.test(text)) tags.add('move');
  if (/儿时|小时候|玩伴|小名/.test(text)) tags.add('childhood');
  if (/邻居|老小区|同一栋|街坊/.test(text)) tags.add('neighbor');
  return Array.from(tags);
}

export function normalizeMissingItem(raw: any): DemoMissingItem {
  const title = raw?.title || `寻找${raw?.target_name || raw?.targetName || '线索'}`;
  const targetName = raw?.target_name || raw?.targetName || '';
  const lostLocation = raw?.lost_location || raw?.lostLocation || '';
  const lostType = raw?.lost_type || raw?.lostType || '';
  const description = raw?.description || raw?.text_only || raw?.textOnly || '';

  return {
    ...raw,
    id: String(raw?.id || `demo-published-${Date.now()}`),
    user_id: raw?.user_id || raw?.userId || 'demo-user',
    title,
    photos: normalizePhotos(raw?.photos),
    letters: normalizePhotos(raw?.letters),
    text_only: raw?.text_only || raw?.textOnly || '',
    ai_keywords: Array.isArray(raw?.ai_keywords) ? raw.ai_keywords : [],
    target_name: targetName,
    target_nickname: raw?.target_nickname || raw?.targetNickname || '',
    lost_time: raw?.lost_time || raw?.lostTime || '',
    lost_location: lostLocation,
    lost_type: lostType,
    description,
    status: raw?.status || 'active',
    view_count: Number(raw?.view_count || raw?.viewCount || 0),
    match_count: Number(raw?.match_count || raw?.matchCount || 0),
    created_at: raw?.created_at || raw?.createdAt || new Date().toISOString(),
    scenario_tags: Array.isArray(raw?.scenario_tags)
      ? raw.scenario_tags
      : inferScenarioTags(`${title} ${targetName} ${lostLocation} ${lostType} ${description}`),
  };
}

export function getLocalPublishedMissing(): DemoMissingItem[] {
  const items = safeJsonParse<any[]>(localStorage.getItem(LOCAL_PUBLISHED_KEY), []);
  return items.map(normalizeMissingItem);
}

export function saveLocalPublishedMissing(item: any) {
  const normalized = normalizeMissingItem(item);
  const current = getLocalPublishedMissing();
  const next = [normalized, ...current.filter(existing => existing.id !== normalized.id)];
  localStorage.setItem(LOCAL_PUBLISHED_KEY, JSON.stringify(next));
  return normalized;
}

export function mergeMissingItems<T extends any>(serverItems: T[], localItems = getLocalPublishedMissing()): T[] {
  const normalizedLocal = localItems.map(normalizeMissingItem) as T[];
  return [...normalizedLocal, ...serverItems]
    .filter((item: any, index, arr: any[]) => {
      const signature = `${item.title || ''}-${item.lost_location || ''}-${item.lost_type || ''}`;
      return arr.findIndex(next => {
        const nextSignature = `${next.title || ''}-${next.lost_location || ''}-${next.lost_type || ''}`;
        return next.id === item.id || nextSignature === signature;
      }) === index;
    })
    .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export function findLocalPublishedMissing(id: string) {
  return getLocalPublishedMissing().find(item => item.id === id) || null;
}

export function getConversationKey(missingPersonId: string, otherUserId: string) {
  return `${missingPersonId}:${otherUserId}`;
}

export function getLocalMessageStore(): DemoMessageStore {
  return safeJsonParse<DemoMessageStore>(localStorage.getItem(LOCAL_MESSAGES_KEY), {});
}

export function saveLocalMessageStore(store: DemoMessageStore) {
  localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(store));
}

export function appendLocalMessage(missingPersonId: string, otherUserId: string, message: DemoMessage) {
  const key = getConversationKey(missingPersonId, otherUserId);
  const store = getLocalMessageStore();
  store[key] = [...(store[key] || []), message];
  saveLocalMessageStore(store);
  return store[key];
}

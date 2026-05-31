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

export const BUILTIN_DEMO_MISSING_ITEMS: DemoMissingItem[] = [
  {
    id: 'demo-old-photo',
    title: '寻找 2005 年小学毕业照里的李明',
    photos: [],
    target_name: '李明',
    target_nickname: '未填写',
    lost_time: '2005 年小学毕业后',
    lost_location: '成都 武侯区',
    lost_type: '搬家失联',
    description: '小学毕业后搬家失联，只记得同班和大概住址。希望通过毕业照、同学关系和原住址线索重新联系。',
    view_count: 1286,
    match_count: 3,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    scenario_tags: ['old-friend', 'classmate', 'move'],
  },
  {
    id: 'demo-classmate-li',
    title: '寻找 2005 年小学毕业照里的李明',
    photos: [],
    target_name: '李明',
    target_nickname: '未填写',
    lost_time: '2005 年小学毕业后',
    lost_location: '成都 武侯区',
    lost_type: '搬家失联',
    description: '小学毕业后搬家失联，只记得同班和大概住址。希望通过毕业照、同学关系和原住址线索重新联系。',
    view_count: 1286,
    match_count: 3,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    scenario_tags: ['old-friend', 'classmate', 'move'],
  },
  {
    id: 'demo-letter',
    title: '旧信件里的广州陈阿姨',
    photos: [],
    target_name: '陈阿姨',
    target_nickname: '陈秀兰',
    lost_time: '约 2009 年',
    lost_location: '广州 越秀区',
    lost_type: '失联',
    description: '从旧信件中识别出建设二路、陈秀兰等线索，希望找到当年帮助过家人的陈阿姨。',
    view_count: 842,
    match_count: 2,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['old-friend', 'letter', 'neighbor'],
  },
  {
    id: 'demo-letter-aunt',
    title: '旧信件里的广州陈阿姨',
    photos: [],
    target_name: '陈阿姨',
    target_nickname: '陈秀兰',
    lost_time: '约 2009 年',
    lost_location: '广州 越秀区',
    lost_type: '失联',
    description: '从旧信件中识别出建设二路、陈秀兰等线索，希望找到当年帮助过家人的陈阿姨。',
    view_count: 842,
    match_count: 2,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['old-friend', 'letter', 'neighbor'],
  },
  {
    id: 'demo-pet-doudou',
    title: '寻找棕色宠物狗豆豆',
    photos: [],
    target_name: '豆豆',
    target_nickname: '棕色小狗',
    lost_time: '今天傍晚',
    lost_location: '上海 徐汇滨江',
    lost_type: '宠物狗走失',
    description: '小型棕色宠物狗，脖子有红色项圈，最后出现在滨江步道附近。性格亲人，听到“豆豆”会回头。',
    view_count: 421,
    match_count: 5,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['pet-dog'],
  },
  {
    id: 'demo-childhood-xiaoyu',
    title: '找儿时玩伴小雨',
    photos: [],
    target_name: '小雨',
    target_nickname: '小雨',
    lost_time: '童年搬家后',
    lost_location: '长沙 开福区',
    lost_type: '儿时玩伴',
    description: '小时候住同一栋楼，只记得小名和经常去的巷口小卖部。希望通过老小区和共同记忆找回联系。',
    view_count: 366,
    match_count: 1,
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['childhood', 'neighbor'],
  },
  {
    id: 'demo-neighbor',
    title: '寻找老邻居林叔',
    photos: [],
    target_name: '林叔',
    target_nickname: '未填写',
    lost_time: '老小区拆迁后',
    lost_location: '厦门 思明区',
    lost_type: '老邻居',
    description: '老小区拆迁后失去联系，记得曾在菜市场附近开修表铺。希望通过社区和旧街坊线索找到人。',
    view_count: 509,
    match_count: 4,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['neighbor', 'move', 'old-friend'],
  },
  {
    id: 'demo-neighbor-lin',
    title: '寻找老邻居林叔',
    photos: [],
    target_name: '林叔',
    target_nickname: '未填写',
    lost_time: '老小区拆迁后',
    lost_location: '厦门 思明区',
    lost_type: '老邻居',
    description: '老小区拆迁后失去联系，记得曾在菜市场附近开修表铺。希望通过社区和旧街坊线索找到人。',
    view_count: 509,
    match_count: 4,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['neighbor', 'move', 'old-friend'],
  },
  {
    id: 'demo-letter-uncle',
    title: '明信片上的杭州周叔',
    photos: [],
    target_name: '周叔',
    target_nickname: '未填写',
    lost_time: '旧明信片年代不详',
    lost_location: '杭州 上城区',
    lost_type: '旧信件线索',
    description: '老明信片仅保留邮戳和部分门牌，需要根据地址线索扩散，寻找可能认识周叔的旧邻居。',
    view_count: 277,
    match_count: 1,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    scenario_tags: ['letter', 'old-friend'],
  },
];

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

export function findDemoMissingById(id: string) {
  const localItem = findLocalPublishedMissing(id);
  if (localItem) return localItem;
  const builtinItem = BUILTIN_DEMO_MISSING_ITEMS.find(item => item.id === id);
  return builtinItem ? normalizeMissingItem(builtinItem) : null;
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

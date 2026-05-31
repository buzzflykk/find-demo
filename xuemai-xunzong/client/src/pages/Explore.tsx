import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { api } from '../lib/api';
import MissingCard from '../components/missing/MissingCard';
import { getLocalPublishedMissing, mergeMissingItems } from '../services/demoDataStore';

type SearchItem = {
  id: string;
  title: string;
  photos: string[];
  target_name: string;
  lost_location: string;
  lost_type: string;
  lost_time?: string;
  view_count: number;
  match_count: number;
  created_at: string;
  description?: string;
  scenario_tags?: string[];
};

const SCENARIO_OPTIONS = [
  { value: 'all', label: '全部', query: '', type: '' },
  { value: 'old-friend', label: '旧友失联', query: '旧友 同学 邻居', type: '失联' },
  { value: 'pet-dog', label: '宠物狗走失', query: '宠物狗 狗狗 走失', type: '走失' },
  { value: 'classmate', label: '老同学', query: '小学 毕业 同学', type: '失联' },
  { value: 'letter', label: '旧信件线索', query: '旧信件 信件 地址', type: '失联' },
  { value: 'move', label: '搬家失联', query: '搬家 失联', type: '搬家失联' },
  { value: 'childhood', label: '儿时玩伴', query: '儿时 玩伴 小名', type: '其他' },
  { value: 'neighbor', label: '老邻居', query: '邻居 老巷 小区', type: '其他' },
];

const EXPLORE_DEMO_ITEMS: SearchItem[] = [
  {
    id: 'demo-classmate-li',
    title: '寻找 2005 年小学毕业照里的李明',
    photos: [],
    target_name: '李明',
    lost_location: '成都 武侯区',
    lost_type: '搬家失联',
    lost_time: '2005 年小学毕业后',
    view_count: 1286,
    match_count: 3,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    description: '小学毕业后搬家失联，只记得同班和大概住址。',
    scenario_tags: ['old-friend', 'classmate', 'move'],
  },
  {
    id: 'demo-letter-aunt',
    title: '旧信件里的广州陈阿姨',
    photos: [],
    target_name: '陈阿姨',
    lost_location: '广州 越秀区',
    lost_type: '失联',
    lost_time: '约 2009 年',
    view_count: 842,
    match_count: 2,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    description: '从旧信件中识别出建设二路、陈秀兰等线索。',
    scenario_tags: ['old-friend', 'letter', 'neighbor'],
  },
  {
    id: 'demo-pet-doudou',
    title: '寻找棕色宠物狗豆豆',
    photos: [],
    target_name: '豆豆',
    lost_location: '上海 徐汇滨江',
    lost_type: '走失',
    lost_time: '今天傍晚',
    view_count: 421,
    match_count: 5,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: '小型棕色狗，脖子有红色项圈，最后出现在滨江步道。',
    scenario_tags: ['pet-dog'],
  },
  {
    id: 'demo-childhood-xiaoyu',
    title: '找儿时玩伴小雨',
    photos: [],
    target_name: '小雨',
    lost_location: '长沙 开福区',
    lost_type: '其他',
    lost_time: '童年搬家后',
    view_count: 366,
    match_count: 1,
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    description: '小时候住同一栋楼，只记得小名和经常去的巷口小卖部。',
    scenario_tags: ['childhood', 'neighbor'],
  },
  {
    id: 'demo-neighbor-lin',
    title: '寻找老邻居林叔',
    photos: [],
    target_name: '林叔',
    lost_location: '厦门 思明区',
    lost_type: '其他',
    lost_time: '老小区拆迁后',
    view_count: 509,
    match_count: 4,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: '老小区拆迁后失去联系，记得曾在菜市场附近开修表铺。',
    scenario_tags: ['neighbor', 'move', 'old-friend'],
  },
  {
    id: 'demo-letter-uncle',
    title: '明信片上的杭州周叔',
    photos: [],
    target_name: '周叔',
    lost_location: '杭州 上城区',
    lost_type: '失联',
    lost_time: '旧明信片年代不详',
    view_count: 277,
    match_count: 1,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: '老明信片仅保留邮戳和部分门牌，需要根据地址线索扩散。',
    scenario_tags: ['letter', 'old-friend'],
  },
];

function inferScenarioTags(text: string) {
  const tags = new Set<string>();
  if (/旧友|同学|朋友|邻居|阿姨|叔/.test(text)) tags.add('old-friend');
  if (/狗|宠物|走失|项圈/.test(text)) tags.add('pet-dog');
  if (/同学|小学|毕业|班/.test(text)) tags.add('classmate');
  if (/信|信件|明信片|邮戳|地址/.test(text)) tags.add('letter');
  if (/搬家|拆迁|迁走/.test(text)) tags.add('move');
  if (/儿时|小时候|玩伴|小名/.test(text)) tags.add('childhood');
  if (/邻居|老小区|同一栋|街坊/.test(text)) tags.add('neighbor');
  return Array.from(tags);
}

function filterExploreItems(items: SearchItem[], q: string, scenarioValue: string) {
  const keyword = q.trim().toLowerCase();
  return items.filter(item => {
    const matchScenario = scenarioValue === 'all' || item.scenario_tags?.includes(scenarioValue);
    const matchKeyword =
      !keyword ||
      [item.title, item.target_name, item.lost_location, item.lost_type, item.description]
        .filter(Boolean)
        .some(text => String(text).toLowerCase().includes(keyword));
    return matchScenario && matchKeyword;
  });
}

function uniqueExploreItems(items: SearchItem[]) {
  return items.filter((item, index, arr) => {
    const signature = `${item.title}-${item.lost_location}-${item.lost_type}`;
    return (
      arr.findIndex(next => {
        const nextSignature = `${next.title}-${next.lost_location}-${next.lost_type}`;
        return next.id === item.id || nextSignature === signature;
      }) === index
    );
  });
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [scenario, setScenario] = useState('all');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scenarioScrollerRef = useRef<HTMLDivElement | null>(null);
  const scenarioDragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const doSearch = useCallback(async (q: string, scenarioValue: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.searchMissing({});
      const mapped: SearchItem[] = data.items.map((i: any) => {
        const description = i.description || '';
        const title = i.title || '';
        const lostLocation = i.lost_location || '';
        const lostType = i.lost_type || '';
        return {
          id: i.id,
          title,
          photos: typeof i.photos === 'string' ? JSON.parse(i.photos) : i.photos || [],
          target_name: i.target_name,
          lost_location: lostLocation,
          lost_type: lostType,
          lost_time: i.lost_time || '',
          view_count: i.view_count || 0,
          match_count: i.match_count || 0,
          created_at: i.created_at,
          description,
          scenario_tags: inferScenarioTags(`${title} ${lostLocation} ${lostType} ${description}`),
        };
      });
      const localPublished = getLocalPublishedMissing() as SearchItem[];
      const merged = uniqueExploreItems(mergeMissingItems([...mapped, ...EXPLORE_DEMO_ITEMS], localPublished));
      setItems(filterExploreItems(merged, q, scenarioValue));
      setHasSearched(true);
    } catch {
      const localPublished = getLocalPublishedMissing() as SearchItem[];
      const fallbackItems = uniqueExploreItems(mergeMissingItems(EXPLORE_DEMO_ITEMS, localPublished));
      setItems(filterExploreItems(fallbackItems, q, scenarioValue));
      setHasSearched(true);
      setError('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch('', 'all');
  }, [doSearch]);

  const getActiveScenario = (value = scenario) =>
    SCENARIO_OPTIONS.find(opt => opt.value === value) || SCENARIO_OPTIONS[0];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = getActiveScenario();
      doSearch(val, current.value);
    }, 300);
  };

  const handleScenarioChange = (value: string) => {
    if (scenarioDragRef.current.moved) return;
    const selected = getActiveScenario(value);
    setScenario(selected.value);
    doSearch(search, selected.value);
  };

  const handleScenarioMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const scroller = scenarioScrollerRef.current;
    if (!scroller) return;
    scenarioDragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
    };
  };

  const handleScenarioMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const scroller = scenarioScrollerRef.current;
    const drag = scenarioDragRef.current;
    if (!scroller || !drag.active) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
      event.preventDefault();
    }
    scroller.scrollLeft = drag.scrollLeft - deltaX;
  };

  const stopScenarioDrag = () => {
    scenarioDragRef.current.active = false;
    window.setTimeout(() => {
      scenarioDragRef.current.moved = false;
    }, 0);
  };

  const retrySearch = () => {
    const current = getActiveScenario();
    doSearch(search, current.value);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 gap-3 pb-24">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="overflow-hidden rounded-xl bg-[var(--color-bg-card)] shadow-sm">
              <div className="aspect-[4/3] w-full animate-pulse bg-[var(--color-bg-secondary)]" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
                <div className="h-2 w-2/3 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center px-8 pt-16 text-center">
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">{error}</p>
          <button
            onClick={retrySearch}
            className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm text-white"
          >
            点击重试
          </button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-8 pt-16 text-center">
          <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">
            {hasSearched ? '暂未找到相关内容' : '探索公共寻人信息'}
          </h2>
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            试试切换场景词条，或输入姓名、地点、关键词继续搜索。
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 pb-24">
        {items.map((item, idx) => (
          <div key={item.id} className={`animate-fade-in-up delay-${Math.min((idx % 4) * 100, 400)}`}>
            <MissingCard
              id={item.id}
              title={item.title}
              photos={item.photos}
              targetName={item.target_name}
              lostLocation={item.lost_location}
              lostType={item.lost_type}
              lostTime={item.lost_time}
              viewCount={item.view_count}
              matchCount={item.match_count}
              createdAt={item.created_at}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 pt-4">
      <div className="mb-3">
        <input
          type="text"
          placeholder="搜索姓名、地点、关键词..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="relative -mx-4 mb-4">
        <div
          ref={scenarioScrollerRef}
          onMouseDown={handleScenarioMouseDown}
          onMouseMove={handleScenarioMouseMove}
          onMouseUp={stopScenarioDrag}
          onMouseLeave={stopScenarioDrag}
          className="cursor-grab overflow-x-auto px-4 pb-1 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex w-max touch-pan-x gap-1.5 pr-8">
          {SCENARIO_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleScenarioChange(opt.value)}
              className={`h-[26px] shrink-0 rounded-full px-4 text-[11px] font-medium leading-[26px] transition-colors ${
                scenario === opt.value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
      </div>

      {renderContent()}
    </div>
  );
}


/**
 * Mock 匹配引擎 — 基于时间 + 地点 + 关键词的简单字符串匹配
 */

export interface MatchInput {
  id: string;
  userId: string;
  targetName: string;
  targetNickname: string;
  lostTime: string;
  lostLocation: string;
  lostType: string;
  description: string;
  keywords: { label: string; value: string; type: string }[];
}

interface MatchResult {
  missingPersonId: string;
  matchedPersonId: string;
  score: number;        // 0-100 匹配度
  clues: {              // 共同线索
    timeMatch: boolean;
    locationMatch: boolean;
    nameMatch: boolean;
    keywordMatches: string[];
  };
}

function normalize(str: string): string {
  return str.replace(/\s+/g, '').toLowerCase();
}

function compareTime(t1: string, t2: string): boolean {
  if (!t1 || !t2) return false;
  const a = t1.replace(/[年\-]/g, '').substring(0, 4);
  const b = t2.replace(/[年\-]/g, '').substring(0, 4);
  if (a && b && a === b) return true;
  // 模糊匹配：年份差值 <= 2
  const na = parseInt(a);
  const nb = parseInt(b);
  if (!isNaN(na) && !isNaN(nb) && Math.abs(na - nb) <= 2) return true;
  return false;
}

function compareLocation(l1: string, l2: string): boolean {
  if (!l1 || !l2) return false;
  const a = normalize(l1);
  const b = normalize(l2);
  if (a === b) return true;
  // 包含关系：一个地点包含另一个
  if (a.includes(b) || b.includes(a)) return true;
  // 共享至少 2 个字符
  const common = [...a].filter(c => b.includes(c)).length;
  return common >= 2;
}

function compareName(n1: string, n2: string): boolean {
  if (!n1 || !n2) return false;
  const a = normalize(n1);
  const b = normalize(n2);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return false;
}

function extractKeywords(input: MatchInput): string[] {
  const words: string[] = [];
  if (input.description) {
    words.push(...input.description.split(/[,，、\s]+/).filter(w => w.length >= 2));
  }
  if (input.keywords?.length) {
    words.push(...input.keywords.map(k => k.value));
  }
  if (input.targetName) words.push(normalize(input.targetName));
  if (input.targetNickname) words.push(normalize(input.targetNickname));
  return [...new Set(words)];
}

export function runMatch(
  source: MatchInput,
  candidates: MatchInput[],
  threshold = 20,
): MatchResult[] {
  const results: MatchResult[] = [];
  const srcKeywords = extractKeywords(source);

  for (const candidate of candidates) {
    if (candidate.id === source.id) continue;

    const timeMatch = compareTime(source.lostTime, candidate.lostTime);
    const locationMatch = compareLocation(source.lostLocation, candidate.lostLocation);
    const nameMatch = compareName(source.targetName, candidate.targetName)
      || compareName(source.targetNickname, candidate.targetNickname);

    // 关键词交叉匹配
    const candKeywords = extractKeywords(candidate);
    const keywordMatches: string[] = [];
    for (const sk of srcKeywords) {
      for (const ck of candKeywords) {
        if (sk.includes(ck) || ck.includes(sk)) {
          keywordMatches.push(sk.length > ck.length ? sk : ck);
        }
      }
    }

    // 计算匹配度
    let score = 0;
    if (timeMatch) score += 25;
    if (locationMatch) score += 30;
    if (nameMatch) score += 25;
    score += Math.min(keywordMatches.length * 10, 20);

    if (score >= threshold) {
      results.push({
        missingPersonId: source.id,
        matchedPersonId: candidate.id,
        score: Math.min(score, 100),
        clues: { timeMatch, locationMatch, nameMatch, keywordMatches: [...new Set(keywordMatches)] },
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/** 获取一条寻人信息的结构化数据，从数据库拼接 */
export function getMatchInputFromDb(
  db: any,
  missingPersonId: string,
): MatchInput | null {
  const result = db.exec(`SELECT * FROM missing_persons WHERE id = '${missingPersonId}'`);
  if (result.length === 0) return null;

  const row = result[0];
  const item: Record<string, any> = {};
  row.columns.forEach((name: string, i: number) => {
    item[name] = row.values[0][i];
  });
  try { item.ai_keywords = JSON.parse(item.ai_keywords); } catch { item.ai_keywords = []; }

  return {
    id: item.id,
    userId: item.user_id,
    targetName: item.target_name || '',
    targetNickname: item.target_nickname || '',
    lostTime: item.lost_time || '',
    lostLocation: item.lost_location || '',
    lostType: item.lost_type || '',
    description: item.description || '',
    keywords: item.ai_keywords || [],
  };
}

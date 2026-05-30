export interface MockKeywordItem {
  label: string;
  value: string;
  type: 'person' | 'location' | 'time' | 'contact' | 'other';
}

export function delay(ms = 1200): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export async function mockPhotoRestore(photoUrl: string): Promise<{
  original: string;
  restored: string;
}> {
  await delay(1000);
  return {
    original: photoUrl,
    restored: photoUrl,
  };
}

export async function mockOCR(): Promise<{
  rawText: string;
  keywords: MockKeywordItem[];
}> {
  await delay(900);
  return {
    rawText: '从照片背面备注中整理到：2005 年小学毕业照，地点可能在成都武侯区。目标人物叫李明，小名小明，毕业后搬家失联。',
    keywords: [
      { label: '姓名', value: '李明', type: 'person' },
      { label: '小名', value: '小明', type: 'other' },
      { label: '时间', value: '2005', type: 'time' },
      { label: '地点', value: '成都武侯区', type: 'location' },
      { label: '场景', value: '老同学', type: 'other' },
    ],
  };
}

export async function mockGeneratePoster(
  photoUrl: string,
  keywords: MockKeywordItem[],
  description: string,
  templateIndex: number,
): Promise<string> {
  await delay(600);
  void photoUrl;
  void keywords;
  void description;
  void templateIndex;
  return '';
}

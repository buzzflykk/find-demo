import html2canvas from 'html2canvas';

/**
 * 将 DOM 元素转换为图片并下载
 */
export async function capturePoster(element: HTMLElement): Promise<Blob | null> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
  } catch {
    return null;
  }
}

/**
 * 使用 Web Share API 分享
 */
export async function shareViaWebAPI(data: {
  title?: string;
  text?: string;
  url: string;
  files?: File[];
}): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const shareData: ShareData = { title: data.title, text: data.text, url: data.url };
    if (data.files?.length) shareData.files = data.files;
    await navigator.share(shareData);
    return true;
  } catch (e: any) {
    // user cancelled or share failed
    if (e.name !== 'AbortError') console.error('分享失败:', e);
    return false;
  }
}

/**
 * 复制链接到剪贴板
 */
export async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // 降级：创建临时 input
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(input);
    return ok;
  }
}

/**
 * 生成分享链接
 */
export function getShareUrl(missingPersonId: string): string {
  const base = window.location.origin;
  return `${base}/public/missing/${missingPersonId}`;
}

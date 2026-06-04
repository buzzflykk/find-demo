import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { mockGeneratePoster, mockOCR, mockPhotoRestore, type MockKeywordItem } from '../services/ai-mock';
import { saveLocalPublishedMissing } from '../services/demoDataStore';

export interface PublishData {
  photos: string[];
  letters: string[];
  textOnly: string;
  photoRestored: { original: string; restored: string } | null;
  ocrResult: { rawText: string; keywords: MockKeywordItem[] } | null;
  targetName: string;
  targetNickname: string;
  lostTime: string;
  lostLocation: string;
  lostType: string;
  description: string;
  posterTemplate: number;
  posterImage: string;
}

const initialData: PublishData = {
  photos: [],
  letters: [],
  textOnly: '',
  photoRestored: null,
  ocrResult: null,
  targetName: '',
  targetNickname: '',
  lostTime: '',
  lostLocation: '',
  lostType: '',
  description: '',
  posterTemplate: 0,
  posterImage: '',
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function imageFileToPreviewUrl(file: File): Promise<string> {
  const rawDataUrl = await fileToDataUrl(file);

  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const maxSide = 1200;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    image.onerror = () => resolve(rawDataUrl);
    image.src = rawDataUrl;
  });
}

export function usePublish() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PublishData>(initialData);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatusText, setAiStatusText] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const update = useCallback((partial: Partial<PublishData>) => {
    setData(d => ({ ...d, ...partial }));
  }, []);

  const addPhoto = useCallback(async (file: File) => {
    const localPreview = await imageFileToPreviewUrl(file);
    setData(d => ({ ...d, photos: [...d.photos, localPreview] }));
    return localPreview;
  }, []);

  const addLetter = useCallback(async (file: File) => {
    const localPreview = await imageFileToPreviewUrl(file);
    setData(d => ({ ...d, letters: [...d.letters, localPreview] }));
    return localPreview;
  }, []);

  const removePhoto = useCallback((index: number) => {
    setData(d => ({ ...d, photos: d.photos.filter((_, i) => i !== index) }));
  }, []);

  const removeLetter = useCallback((index: number) => {
    setData(d => ({ ...d, letters: d.letters.filter((_, i) => i !== index) }));
  }, []);

  const runAiProcessing = useCallback(async () => {
    setAiBusy(true);
    setAiProgress(0);
    setAiStatusText('正在整理上传内容...');

    const progressInterval = window.setInterval(() => {
      setAiProgress(p => Math.min(p + 15, 90));
    }, 500);

    try {
      let restored = null;
      if (data.photos.length > 0) {
        restored = await mockPhotoRestore(data.photos[0]);
        setAiProgress(45);
        setAiStatusText('正在生成清晰预览...');
      }

      const ocr = await mockOCR();
      setAiProgress(80);
      setAiStatusText('正在提取可填写线索...');
      await new Promise(r => window.setTimeout(r, 800));

      setData(d => ({
        ...d,
        photoRestored: restored,
        ocrResult: ocr,
      }));
      setAiProgress(100);
      setAiStatusText('整理完成');
    } finally {
      window.clearInterval(progressInterval);
      setAiBusy(false);
    }
  }, [data.photos]);

  const generatePoster = useCallback(async () => {
    const keywords = data.ocrResult?.keywords || [];
    await mockGeneratePoster(
      data.photos[0] || '',
      keywords,
      data.description,
      data.posterTemplate,
    );
  }, [data]);

  const publish = useCallback(async () => {
    setPublishing(true);
    setPublishError('');

    const fallbackId = `demo-published-${Date.now()}`;
    const payload = {
      title: `寻找${data.targetName || '旧友'}`,
      photos: data.photos,
      letters: data.letters,
      text_only: data.textOnly,
      ai_keywords: data.ocrResult?.keywords || [],
      target_name: data.targetName,
      target_nickname: data.targetNickname,
      lost_time: data.lostTime,
      lost_location: data.lostLocation,
      lost_type: data.lostType,
      description: data.description || data.textOnly,
      poster_image: data.posterImage,
    };

    try {
      const result = await api.createMissing(payload);
      const publishedResultId = result.id || fallbackId;
      if (!result.id) {
        saveLocalPublishedMissing({
          id: publishedResultId,
          user_id: 'demo-user',
          ...payload,
          status: 'active',
          view_count: 0,
          match_count: 0,
          created_at: new Date().toISOString(),
        });
        setPublishError('演示数据已保存到本机。');
      }
      setPublishedId(publishedResultId);
      setStep(6);
    } catch {
      try {
        saveLocalPublishedMissing({
          id: fallbackId,
          user_id: 'demo-user',
          ...payload,
          status: 'active',
          view_count: 0,
          match_count: 0,
          created_at: new Date().toISOString(),
        });
        setPublishedId(fallbackId);
        setPublishError('演示数据已保存到本机。');
        setStep(6);
      } catch {
        setPublishError('图片保存失败：本机存储空间不足，请换一张较小的图片后重试。');
      }
    } finally {
      setPublishing(false);
    }
  }, [data]);

  const reset = useCallback(() => {
    setStep(1);
    setData(initialData);
    setAiBusy(false);
    setAiProgress(0);
    setPublishError('');
    setPublishedId(null);
  }, []);

  const next = useCallback(() => setStep(s => Math.min(s + 1, 6)), []);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  return {
    step,
    data,
    update,
    aiBusy,
    aiProgress,
    aiStatusText,
    publishing,
    publishError,
    publishedId,
    addPhoto,
    addLetter,
    removePhoto,
    removeLetter,
    runAiProcessing,
    generatePoster,
    publish,
    next,
    prev,
    reset,
    setStep,
  };
}


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublish, type PublishData } from '../hooks/usePublish';
import StepIndicator from '../components/publish/StepIndicator';
import PublishStep1 from './PublishStep1';
import PublishStep2 from './PublishStep2';
import PublishStep3 from './PublishStep3';
import PublishStep4 from './PublishStep4';
import PublishStep5 from './PublishStep5';
import PublishStep6 from './PublishStep6';

const stepLabels = ['上传', '整理', '结果', '补充', '分享卡', '发布'];

function getKeyword(data: PublishData, label: string, type?: string) {
  return data.ocrResult?.keywords.find(item => item.label === label || item.type === type)?.value || '';
}

export default function Publish() {
  const navigate = useNavigate();
  const {
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
    publish,
    prev,
    reset,
    setStep,
  } = usePublish();

  useEffect(() => {
    if (step === 2 && !aiBusy && !data.photoRestored && !data.ocrResult) {
      runAiProcessing();
    }
  }, [step, aiBusy, data.photoRestored, data.ocrResult, runAiProcessing]);

  const fillFromRecognizedClues = () => {
    const targetName = data.targetName || getKeyword(data, '姓名', 'person');
    const targetNickname = data.targetNickname || getKeyword(data, '小名');
    const lostTime = data.lostTime || getKeyword(data, '时间', 'time');
    const lostLocation = data.lostLocation || getKeyword(data, '地点', 'location');
    const lostType = data.lostType || getKeyword(data, '场景') || '老同学';
    const description = data.description || data.ocrResult?.rawText || data.textOnly;

    update({
      targetName,
      targetNickname,
      lostTime,
      lostLocation,
      lostType,
      description,
    });
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) {
      prev();
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/home', { replace: true });
  };

  return (
    <div className="pt-4">
      <div className="mb-4 flex items-center justify-between px-4">
        <button onClick={handleBack} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <h2 className="text-base font-medium text-[var(--color-text)]">发布新寻人</h2>
        {step === 6 && publishedId ? (
          <button onClick={reset} className="text-sm text-[var(--color-primary)]">
            再发一条
          </button>
        ) : (
          <div className="w-14" />
        )}
      </div>

      <div className="px-4">
        <StepIndicator currentStep={step} totalSteps={6} labels={stepLabels} />
      </div>

      {step === 1 && (
        <PublishStep1
          photos={data.photos}
          letters={data.letters}
          textOnly={data.textOnly}
          onAddPhoto={addPhoto}
          onAddLetter={addLetter}
          onRemovePhoto={removePhoto}
          onRemoveLetter={removeLetter}
          onTextChange={(text) => update({ textOnly: text })}
          onNext={() => {
            if (data.textOnly && data.photos.length === 0 && data.letters.length === 0) {
              setStep(4);
            } else {
              setStep(2);
            }
          }}
        />
      )}

      {step === 2 && (
        <PublishStep2
          progress={aiProgress}
          statusText={aiStatusText}
          busy={aiBusy}
          photoUrl={data.photos[0] || data.letters[0] || ''}
          onComplete={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PublishStep3
          restored={data.photoRestored}
          ocrResult={data.ocrResult}
          onNext={fillFromRecognizedClues}
          onPrev={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <PublishStep4
          initial={{
            targetName: data.targetName,
            targetNickname: data.targetNickname,
            lostTime: data.lostTime,
            lostLocation: data.lostLocation,
            lostType: data.lostType,
            description: data.description,
          }}
          onSave={(formData) => update(formData)}
          onNext={() => setStep(5)}
          onPrev={() => data.photos.length > 0 || data.letters.length > 0 ? setStep(3) : setStep(1)}
        />
      )}

      {step === 5 && (
        <PublishStep5
          photoUrl={data.photos[0] || ''}
          targetName={data.targetName}
          lostTime={data.lostTime}
          lostLocation={data.lostLocation}
          description={data.description}
          onTemplateChange={(i) => update({ posterTemplate: i })}
          onNext={() => setStep(6)}
          onPrev={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <PublishStep6
          publishedId={publishedId}
          publishing={publishing}
          error={publishError}
          onPublish={publish}
        />
      )}
    </div>
  );
}

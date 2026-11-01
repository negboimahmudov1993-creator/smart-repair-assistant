import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  CheckCircle2,
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

interface ProblemInputSectionProps {
  description: string;
  onChangeDescription: (val: string) => void;
  imageFile: File | null;
  imageBase64: string | null;
  onSetImage: (file: File | null, base64: string | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ProblemInputSection: React.FC<ProblemInputSectionProps> = ({
  description,
  onChangeDescription,
  imageBase64,
  onSetImage,
  onAnalyze,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = APP_CONFIG.maxPhotoDim;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', APP_CONFIG.photoQuality);
          onSetImage(file, compressedBase64);
        } else {
          onSetImage(file, rawDataUrl);
        }
      };
      img.onerror = () => {
        onSetImage(file, rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleRemoveImage = () => {
    onSetImage(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Голосовой ввод не поддерживается вашим браузером.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChangeDescription(description ? `${description} ${transcript}` : transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4 bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-lg shadow-orange-500/5 hover:border-slate-300/90 transition-colors"
    >
      {/* Hidden file & camera inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 1. Photo Upload / Camera Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-orange-600" />
            <span>Фотография поломки</span>
          </span>

          <AnimatePresence>
            {imageBase64 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 min-h-[44px] px-2 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" /> Удалить
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {!imageBase64 ? (
          <motion.div
            id="photo-upload-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            animate={{
              scale: isDragging ? 1.02 : 1,
              borderColor: isDragging ? '#ea580c' : '#cbd5e1',
            }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl p-4 sm:p-6 text-center border-2 border-dashed transition-colors ${
              isDragging
                ? 'bg-orange-500/10 shadow-md shadow-orange-500/10'
                : 'bg-slate-50/70 hover:bg-slate-50 hover:border-orange-400'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 cursor-pointer"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-6 h-6" />
              </motion.div>

              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Сфотографируйте поломку или загрузите фото
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ИИ сам определит деталь, тип поломки и масштаб ремонта
                </p>
              </div>

              {/* Action Buttons with 44px min height & active scale feedback */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-1">
                <motion.button
                  id="btn-take-photo"
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => cameraInputRef.current?.click()}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/20 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Снять на камеру</span>
                </motion.button>

                <motion.button
                  id="btn-upload-file"
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-slate-600" />
                  <span>Из галереи</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md"
          >
            <img
              src={imageBase64}
              alt="Фото поломки"
              className="w-full max-h-56 sm:max-h-64 object-contain mx-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-xl backdrop-blur-md font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Фото прикреплено
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleRemoveImage}
                className="min-h-[44px] bg-red-600 hover:bg-red-700 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Заменить
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 2. Problem Description Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="problem-description-input"
            className="text-xs sm:text-sm font-bold text-slate-900"
          >
            Что случилось? (симптомы или звуки)
          </label>

          {/* Voice input button with pulse animation */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={toggleSpeechRecognition}
            className={`min-h-[44px] text-xs flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-100 text-red-700 font-bold border border-red-300 shadow-sm animate-pulse'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}
            title="Голосовой ввод"
          >
            {isRecording ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
            ) : (
              <Mic className="w-4 h-4 text-orange-600" />
            )}
            <span>{isRecording ? 'Слушаю...' : 'Диктовать'}</span>
          </motion.button>
        </div>

        <div className="relative">
          <textarea
            id="problem-description-input"
            rows={3}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Опишите поломку своими словами, например: капает из-под смесителя на кухне, искрит розетка, стиральная машина не сливает воду..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 focus:bg-white focus:border-orange-500 focus:ring-3 focus:ring-orange-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-all outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* Primary CTA Button with Internal Progress Animation */}
      <motion.button
        id="btn-calculate-solution"
        type="button"
        whileHover={!isLoading && (description.trim() || imageBase64) ? { scale: 1.015, y: -1 } : {}}
        whileTap={!isLoading && (description.trim() || imageBase64) ? { scale: 0.98 } : {}}
        disabled={isLoading || (!description.trim() && !imageBase64)}
        onClick={onAnalyze}
        className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base text-white flex items-center justify-center gap-2 relative overflow-hidden transition-all shadow-md ${
          isLoading || (!description.trim() && !imageBase64)
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-amber-700 shadow-orange-600/25 cursor-pointer'
        }`}
      >
        {isLoading ? (
          <>
            {/* Animated internal progress bar inside button */}
            <div className="absolute inset-0 bg-white/15 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10">ИИ анализирует поломку...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            <span>Рассчитать смету и найти решение</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

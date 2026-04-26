import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ImageAnalyzerPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-foreground">
        {language === 'en' ? 'Image Analyzer' : language === 'ua' ? 'Аналіз зображень' : 'Анализ изображений'}
      </h1>
      <div className="glass-strong rounded-xl p-5">
        <ImageAnalyzer />
      </div>
    </div>
  );
};

export default ImageAnalyzerPage;

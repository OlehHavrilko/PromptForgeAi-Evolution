import { TextTools } from "@/components/TextTools";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TextToolsPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-foreground">
        {language === 'en' ? 'Text Tools' : language === 'ua' ? 'Текстові інструменти' : 'Текстовые инструменты'}
      </h1>
      <div className="glass-strong rounded-xl p-5">
        <TextTools />
      </div>
    </div>
  );
};

export default TextToolsPage;

import { useTranslation } from 'react-i18next';

const useIsEng = () => {
  const { i18n } = useTranslation();

  const isEng = () => {
    return !!(i18n.language === 'en');
  };

  return { isEng };
};

export default useIsEng;

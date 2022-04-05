import I18n from 'react-native-i18n';
import en from '@app/locales/en';
import vi from '@app/locales/vi';

I18n.fallbacks = true;
I18n.missingBehaviour = 'guess';
I18n.defaultLocale = 'en';
I18n.locale = 'en';

I18n.translations = {
  vi,
  en,
};

export const setLocale = (locale) => {
  I18n.locale = locale;
};

export const getCurrentLocale = () => I18n.locale;

export const translateHeaderText = (langKey) => ({ screenProps }) => {
  const title = I18n.translate(langKey, screenProps.language);
  return { title };
};

export default I18n.translate.bind(I18n);

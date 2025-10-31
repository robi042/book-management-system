export * from './loggerMiddleware';
export * from './noSniffMiddleware';
export * from './xPoweredByMiddleware';

export const localize = (req, res, next): any => {
  try {
    if (req && typeof req.acceptsLanguages === 'function') {
      let locale = req.acceptsLanguages()[0] || 'en';
      locale = locale && locale.includes('-') ? locale.slice(0, -3) : locale;
      if (req.i18n && typeof req.i18n.setLocale === 'function') {
        req.i18n.setLocale(locale);
      }
    }
  } catch {}
  next();
};

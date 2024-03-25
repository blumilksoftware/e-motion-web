import { Locales } from "./locales";

import en from "./en.json";
import pl from "./pl.json";

export const messages = {
  [Locales.EN]: en,
  [Locales.PL]: pl,
};

export const defaultLocale = Locales.EN;

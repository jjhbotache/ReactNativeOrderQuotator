import { createContext } from "react";


export const languageContext =  createContext({
  language: "es",
  setLanguage: (language: "en" | "es") => {}
}as{
  language: "es" | "en",
  setLanguage: (language: "en" | "es") => void
});

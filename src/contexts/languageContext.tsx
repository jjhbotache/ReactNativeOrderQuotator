import { createContext } from "react";


export const languageContext =  createContext({
  language: "es",
  setLanguage: (language: "en" | "es") => {}
});

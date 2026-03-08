import { useState, useEffect } from "react";
import "./LanguageCurrencyModal.css";

const STORAGE_LANG = "airbnb_language";
const STORAGE_REGION = "airbnb_region";
const STORAGE_CURRENCY = "airbnb_currency";
const STORAGE_TRANSLATION = "airbnb_translation";

const SUGGESTED_LANGUAGES = [
  { lang: "English", region: "United States", id: "en-US" },
  { lang: "English", region: "United Kingdom", id: "en-GB" },
  { lang: "Gaeilge", region: "Éire", id: "ga-IE" },
];

const LANGUAGES = [
  { lang: "English", region: "United States", id: "en-US" },
  { lang: "English", region: "United Kingdom", id: "en-GB" },
  { lang: "English", region: "Ireland", id: "en-IE" },
  { lang: "Gaeilge", region: "Éire", id: "ga-IE" },
  { lang: "Afrikaans", region: "South Africa", id: "af-ZA" },
  { lang: "Azərbaycan dili", region: "Azərbaycan", id: "az-AZ" },
  { lang: "Bahasa Indonesia", region: "Indonesia", id: "id-ID" },
  { lang: "Bosanski", region: "Bosna i Hercegovina", id: "bs-BA" },
  { lang: "Català", region: "Espanya", id: "ca-ES" },
  { lang: "Čeština", region: "Česká republika", id: "cs-CZ" },
  { lang: "Crnogorski", region: "Crna Gora", id: "cnr-ME" },
  { lang: "Dansk", region: "Danmark", id: "da-DK" },
  { lang: "Deutsch", region: "Deutschland", id: "de-DE" },
  { lang: "Deutsch", region: "Österreich", id: "de-AT" },
  { lang: "Español", region: "España", id: "es-ES" },
  { lang: "Español", region: "México", id: "es-MX" },
  { lang: "Français", region: "France", id: "fr-FR" },
  { lang: "Italiano", region: "Italia", id: "it-IT" },
  { lang: "Nederlands", region: "Nederland", id: "nl-NL" },
  { lang: "Norsk", region: "Norge", id: "nb-NO" },
  { lang: "Polski", region: "Polska", id: "pl-PL" },
  { lang: "Português", region: "Brasil", id: "pt-BR" },
  { lang: "Português", region: "Portugal", id: "pt-PT" },
  { lang: "South Africa (English)", region: "South Africa", id: "en-ZA" },
  { lang: "Svenska", region: "Sverige", id: "sv-SE" },
  { lang: "Türkçe", region: "Türkiye", id: "tr-TR" },
  { lang: "中文", region: "简体", id: "zh-CN" },
  { lang: "日本語", region: "日本", id: "ja-JP" },
];

const CURRENCIES = [
  { code: "ZAR", name: "South African Rand" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "INR", name: "Indian Rupee" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "NGN", name: "Nigerian Naira" },
];

const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const LanguageCurrencyModal = () => {
  const [tab, setTab] = useState("language");
  const [translate, setTranslate] = useState(() => getStored(STORAGE_TRANSLATION, "true") === "true");
  const [languageId, setLanguageId] = useState(() => getStored(STORAGE_LANG, "en-US"));
  const [currency, setCurrency] = useState(() => getStored(STORAGE_CURRENCY, "ZAR"));

  useEffect(() => {
    setStored(STORAGE_TRANSLATION, translate ? "true" : "false");
  }, [translate]);

  const handleSelectLanguage = (id) => {
    setLanguageId(id);
    const item = LANGUAGES.find((l) => l.id === id);
    if (item) {
      setStored(STORAGE_LANG, id);
      setStored(STORAGE_REGION, item.region);
    }
  };

  const handleSelectCurrency = (code) => {
    setCurrency(code);
    setStored(STORAGE_CURRENCY, code);
  };

  return (
    <div className="lang_modal">
      <div className="lang_modal_tabs">
        <button
          type="button"
          className={`lang_modal_tab ${tab === "language" ? "lang_modal_tab_active" : ""}`}
          onClick={() => setTab("language")}
        >
          Language and region
        </button>
        <button
          type="button"
          className={`lang_modal_tab ${tab === "currency" ? "lang_modal_tab_active" : ""}`}
          onClick={() => setTab("currency")}
        >
          Currency
        </button>
      </div>

      {tab === "language" && (
        <div className="lang_modal_panel">
          <div className="lang_modal_translation">
            <h3 className="lang_modal_sectionTitle">Translation</h3>
            <p className="lang_modal_translationDesc">Automatically translate descriptions and reviews to English.</p>
            <button
              type="button"
              role="switch"
              aria-checked={translate}
              className={`lang_modal_toggle ${translate ? "lang_modal_toggle_on" : ""}`}
              onClick={() => setTranslate((prev) => !prev)}
            >
              <span className="lang_modal_toggle_thumb" />
            </button>
          </div>

          <h3 className="lang_modal_sectionTitle">Suggested languages and regions</h3>
          <div className="lang_modal_suggested">
            {SUGGESTED_LANGUAGES.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`lang_modal_option ${languageId === item.id ? "lang_modal_option_selected" : ""}`}
                onClick={() => handleSelectLanguage(item.id)}
              >
                <span className="lang_modal_option_lang">{item.lang}</span>
                <span className="lang_modal_option_region">{item.region}</span>
              </button>
            ))}
          </div>

          <h3 className="lang_modal_sectionTitle">Choose a language and region</h3>
          <div className="lang_modal_list">
            {LANGUAGES.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`lang_modal_option lang_modal_option_full ${languageId === item.id ? "lang_modal_option_selected" : ""}`}
                onClick={() => handleSelectLanguage(item.id)}
              >
                <span className="lang_modal_option_lang">{item.lang}</span>
                <span className="lang_modal_option_region">{item.region}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "currency" && (
        <div className="lang_modal_panel">
          <h3 className="lang_modal_sectionTitle">Choose a currency</h3>
          <div className="lang_modal_list lang_modal_currencies">
            {CURRENCIES.map((c) => (
              <button
                type="button"
                key={c.code}
                className={`lang_modal_option lang_modal_option_currency ${currency === c.code ? "lang_modal_option_selected" : ""}`}
                onClick={() => handleSelectCurrency(c.code)}
              >
                <span className="lang_modal_option_lang">{c.code}</span>
                <span className="lang_modal_option_region">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageCurrencyModal;


import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.diagnosis': 'Diagnosis',
    'nav.firstAid': 'First Aid',
    'nav.results': 'Results',
    
    // Home page
    'home.title': 'AI Medical Assistant',
    'home.subtitle': 'Get instant medical guidance with AI-powered diagnosis and first aid support',
    'home.features.diagnosis': 'Smart Diagnosis',
    'home.features.diagnosis.desc': 'AI-powered symptom analysis',
    'home.features.firstAid': 'First Aid Guide',
    'home.features.firstAid.desc': 'Step-by-step emergency instructions',
    'home.features.voice': 'Voice Assistant',
    'home.features.voice.desc': 'Hands-free interaction',
    'home.cta': 'Start Diagnosis',
    
    // Diagnosis
    'diagnosis.title': 'Medical Diagnosis',
    'diagnosis.symptoms': 'Select Your Symptoms',
    'diagnosis.bodyMap': 'Body Map',
    'diagnosis.voiceInput': 'Voice Input',
    'diagnosis.analyze': 'Analyze Symptoms',
    'diagnosis.listening': 'Listening...',
    'diagnosis.startRecording': 'Start Recording',
    'diagnosis.stopRecording': 'Stop Recording',
    
    // First Aid
    'firstAid.title': 'First Aid Guide',
    'firstAid.emergency': 'Emergency Situations',
    'firstAid.search': 'Search conditions...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.diagnosis': 'Diagnóstico',
    'nav.firstAid': 'Primeros Auxilios',
    'nav.results': 'Resultados',
    
    // Home page
    'home.title': 'Asistente Médico IA',
    'home.subtitle': 'Obtén orientación médica instantánea con diagnóstico y soporte de primeros auxilios impulsado por IA',
    'home.features.diagnosis': 'Diagnóstico Inteligente',
    'home.features.diagnosis.desc': 'Análisis de síntomas impulsado por IA',
    'home.features.firstAid': 'Guía de Primeros Auxilios',
    'home.features.firstAid.desc': 'Instrucciones de emergencia paso a paso',
    'home.features.voice': 'Asistente de Voz',
    'home.features.voice.desc': 'Interacción manos libres',
    'home.cta': 'Iniciar Diagnóstico',
    
    // Diagnosis
    'diagnosis.title': 'Diagnóstico Médico',
    'diagnosis.symptoms': 'Selecciona Tus Síntomas',
    'diagnosis.bodyMap': 'Mapa Corporal',
    'diagnosis.voiceInput': 'Entrada de Voz',
    'diagnosis.analyze': 'Analizar Síntomas',
    'diagnosis.listening': 'Escuchando...',
    'diagnosis.startRecording': 'Iniciar Grabación',
    'diagnosis.stopRecording': 'Detener Grabación',
    
    // First Aid
    'firstAid.title': 'Guía de Primeros Auxilios',
    'firstAid.emergency': 'Situaciones de Emergencia',
    'firstAid.search': 'Buscar condiciones...',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.diagnosis': 'Diagnostic',
    'nav.firstAid': 'Premiers Secours',
    'nav.results': 'Résultats',
    
    // Home page
    'home.title': 'Assistant Médical IA',
    'home.subtitle': 'Obtenez des conseils médicaux instantanés avec un diagnostic et un support de premiers secours alimentés par IA',
    'home.features.diagnosis': 'Diagnostic Intelligent',
    'home.features.diagnosis.desc': 'Analyse de symptômes alimentée par IA',
    'home.features.firstAid': 'Guide des Premiers Secours',
    'home.features.firstAid.desc': 'Instructions d\'urgence étape par étape',
    'home.features.voice': 'Assistant Vocal',
    'home.features.voice.desc': 'Interaction mains libres',
    'home.cta': 'Commencer le Diagnostic',
    
    // Diagnosis
    'diagnosis.title': 'Diagnostic Médical',
    'diagnosis.symptoms': 'Sélectionnez Vos Symptômes',
    'diagnosis.bodyMap': 'Carte Corporelle',
    'diagnosis.voiceInput': 'Entrée Vocale',
    'diagnosis.analyze': 'Analyser les Symptômes',
    'diagnosis.listening': 'Écoute...',
    'diagnosis.startRecording': 'Commencer l\'Enregistrement',
    'diagnosis.stopRecording': 'Arrêter l\'Enregistrement',
    
    // First Aid
    'firstAid.title': 'Guide des Premiers Secours',
    'firstAid.emergency': 'Situations d\'Urgence',
    'firstAid.search': 'Rechercher des conditions...',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur survenue',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.diagnosis': 'Diagnose',
    'nav.firstAid': 'Erste Hilfe',
    'nav.results': 'Ergebnisse',
    
    // Home page
    'home.title': 'KI-Medizinassistent',
    'home.subtitle': 'Erhalten Sie sofortige medizinische Beratung mit KI-gestützter Diagnose und Erste-Hilfe-Unterstützung',
    'home.features.diagnosis': 'Intelligente Diagnose',
    'home.features.diagnosis.desc': 'KI-gestützte Symptomanalyse',
    'home.features.firstAid': 'Erste-Hilfe-Leitfaden',
    'home.features.firstAid.desc': 'Schritt-für-Schritt Notfallanweisungen',
    'home.features.voice': 'Sprachassistent',
    'home.features.voice.desc': 'Freisprechende Interaktion',
    'home.cta': 'Diagnose Starten',
    
    // Diagnosis
    'diagnosis.title': 'Medizinische Diagnose',
    'diagnosis.symptoms': 'Wählen Sie Ihre Symptome',
    'diagnosis.bodyMap': 'Körperkarte',
    'diagnosis.voiceInput': 'Spracheingabe',
    'diagnosis.analyze': 'Symptome Analysieren',
    'diagnosis.listening': 'Höre zu...',
    'diagnosis.startRecording': 'Aufnahme Starten',
    'diagnosis.stopRecording': 'Aufnahme Stoppen',
    
    // First Aid
    'firstAid.title': 'Erste-Hilfe-Leitfaden',
    'firstAid.emergency': 'Notfallsituationen',
    'firstAid.search': 'Zustände suchen...',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler aufgetreten',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.submit': 'Senden',
    'common.cancel': 'Abbrechen',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.diagnosis': '诊断',
    'nav.firstAid': '急救',
    'nav.results': '结果',
    
    // Home page
    'home.title': 'AI医疗助手',
    'home.subtitle': '通过AI驱动的诊断和急救支持获得即时医疗指导',
    'home.features.diagnosis': '智能诊断',
    'home.features.diagnosis.desc': 'AI驱动的症状分析',
    'home.features.firstAid': '急救指南',
    'home.features.firstAid.desc': '逐步紧急指导',
    'home.features.voice': '语音助手',
    'home.features.voice.desc': '免提交互',
    'home.cta': '开始诊断',
    
    // Diagnosis
    'diagnosis.title': '医疗诊断',
    'diagnosis.symptoms': '选择您的症状',
    'diagnosis.bodyMap': '身体图',
    'diagnosis.voiceInput': '语音输入',
    'diagnosis.analyze': '分析症状',
    'diagnosis.listening': '正在听...',
    'diagnosis.startRecording': '开始录音',
    'diagnosis.stopRecording': '停止录音',
    
    // First Aid
    'firstAid.title': '急救指南',
    'firstAid.emergency': '紧急情况',
    'firstAid.search': '搜索症状...',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.back': '返回',
    'common.next': '下一步',
    'common.submit': '提交',
    'common.cancel': '取消',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

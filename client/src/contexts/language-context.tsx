import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Sample translations
const translations: Translations = {
  en: {
    // Navigation
    'about': 'About',
    'features': 'Features',
    'pricing': 'Pricing',
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'dashboard': 'Dashboard',

    // Dashboard
    'totalProducts': 'Total Products',
    'productsInInventory': 'Products in inventory',
    'locations': 'Locations',
    'activeLocations': 'Active locations',
    'suppliers': 'Suppliers',
    'activeSuppliers': 'Active suppliers',
    'recentStockMovements': 'Recent Stock Movements',
    'latestInventoryTransactions': 'Latest inventory transactions across all locations',
    'viewAllMovements': 'View all movements',
    'noStockMovementsYet': 'No stock movements yet',
    'stockMovementsWillAppearHere': 'Stock movements will appear here as they occur',
    'lowStockItems': 'Low Stock Items',
    'productsRequiringAttention': 'Products requiring attention due to low stock levels',
    'lowStockItemsList': 'Low stock items will be displayed here',
    'comingSoon': 'Coming soon',

    // Stock Movements
    'stockMovements': 'Stock Movements',
    'stockMovementHistory': 'Stock Movement History',
    'viewAllStockMovementsAcrossLocations': 'View all stock movements across locations',
    'filterByProduct': 'Filter by product',
    'allProducts': 'All products',
    'export': 'Export',
    'date': 'Date',
    'product': 'Product',
    'type': 'Type',
    'from': 'From',
    'to': 'To',
    'quantity': 'Quantity',
    'reference': 'Reference',
    'transfer': 'Transfer',
    'adjustment': 'Adjustment',
    'noStockMovementsFound': 'No stock movements found',
  },
  es: {
    dashboard: 'Panel',
    products: 'Productos',
    locations: 'Ubicaciones',
    suppliers: 'Proveedores',
    customers: 'Clientes',
    reports: 'Informes',
    settings: 'Configuración',
    profile: 'Perfil',
    stock: 'Inventario',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
  },
  fr: {
    dashboard: 'Tableau de bord',
    products: 'Produits',
    locations: 'Emplacements',
    suppliers: 'Fournisseurs',
    customers: 'Clients',
    reports: 'Rapports',
    settings: 'Paramètres',
    profile: 'Profil',
    stock: 'Stock',
    notifications: 'Notifications',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'S\'inscrire',
  },
  de: {
    dashboard: 'Dashboard',
    products: 'Produkte',
    locations: 'Standorte',
    suppliers: 'Lieferanten',
    customers: 'Kunden',
    reports: 'Berichte',
    settings: 'Einstellungen',
    profile: 'Profil',
    stock: 'Bestand',
    notifications: 'Benachrichtigungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
  },
  zh: {
    dashboard: '仪表板',
    products: '产品',
    locations: '地点',
    suppliers: '供应商',
    customers: '客户',
    reports: '报告',
    settings: '设置',
    profile: '个人资料',
    stock: '库存',
    notifications: '通知',
    logout: '登出',
    login: '登录',
    register: '注册',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const availableLanguages: Language[] = ['en', 'es', 'fr', 'de', 'zh'];

  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
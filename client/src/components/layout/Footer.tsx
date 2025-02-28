
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-auto px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-sm text-muted-foreground">
          © {currentYear} Modulus SaaS. {t('allRightsReserved')}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">
            {t('termsOfService')}
          </Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
            {t('privacyPolicy')}
          </Link>
          <Link to="/support" className="text-muted-foreground hover:text-foreground">
            {t('support')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

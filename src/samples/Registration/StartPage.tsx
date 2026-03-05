import React, { useEffect, useState } from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import dayjs from 'dayjs';

export default function StartPage(props) {
  const { languageToggleCallback } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { i18n } = useTranslation();
  let lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);

  const changeLanguage = e => {
    e.preventDefault();
    lang = e.currentTarget.getAttribute('lang');
    setSelectedLang(lang);
    sessionStorage.setItem('rsdk_locale', `${lang}_GB`);
    dayjs.locale(lang);
    i18n.changeLanguage(lang).then(() => {
      setPageTitle();
    });
    if (typeof PCore !== 'undefined') {
      PCore.getEnvironmentInfo().setLocale(`${lang}_GB`);
      PCore.getLocaleUtils().resetLocaleStore();
      PCore.getLocaleUtils().loadLocaleResources([
        PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
        '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
        '@BASECLASS!DATAPAGE!D_HICBCREFERENCEDATALISTBYTYPE'
      ]);

      PCore.getPubSubUtils().publish('languageToggleTriggered', { language: lang, localeRef: [] });
    }
    if (languageToggleCallback) {
      languageToggleCallback(lang);
    }
  };

  // Initialises language value in session storage, and for dayjs
  useEffect(() => {
    if (!sessionStorage.getItem('rsdk_locale')) {
      sessionStorage.setItem('rsdk_locale', `en_GB`);
      dayjs.locale('en');
    } else {
      const currentLang = sessionStorage.getItem('rsdk_locale').slice(0, 2).toLowerCase();
      dayjs.locale(currentLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = selectedLang;
  }, [selectedLang]);

  return (
    <>
      <h1 className='govuk-heading-xl'>{t('REG_PAGE_HEADING')}</h1>
      <p className='govuk-body'>{t('REG_PAGE_USE_THIS_SERVICE')}</p>
      <p className='govuk-body'>{t('REG_PAGE_REGULAR_INCOME_TAX')}</p>
      <p className='govuk-body'>{t('REG_PAGE_ADJUST_TAX_CODE')}</p>
      <p className='govuk-body'>{t('REG_PAGE_SHOULD_USE_SERVICE')}</p>
      <ul className='govuk-list govuk-list--bullet'>
        <li>{t('REG_PAGE_NOT_SA_REGISTERED')}</li>
        <li>{t('REG_PAGE_NO_PLAN_TO_SA')}</li>
        <li>{t('REG_PAGE_BE_HIGHEST_EARNER')}</li>
      </ul>
      <h2 className='govuk-heading'>{t('REG_PAGE_BEFORE_START')}</h2>
      <p className='govuk-body'>{t('REG_PAGE_NEED_USE_SERVICE')}</p>
      <ul className='govuk-list govuk-list--bullet'>
        <li>{t('REG_PAGE_NEED_PARTNER_INFO')}</li>
        <li>{t('REG_PAGE_NEED_SIGN_IN_DETAILS')}</li>
      </ul>
      <p className='govuk-body'>{t('REG_PAGE_CAN_NOT_SAVE_PROGRESS')}</p>
      <div className='govuk-inset-text'>
        {lang === 'en' ? (
          <>
            {'This service is also available '}{' '}
            <a href='#' onClick={changeLanguage} lang='cy' rel='alternate' className='govuk-link'>
              in Welsh (Cymraeg).
            </a>
          </>
        ) : (
          <>
            {'Mae’r dudalen hon ar gael hefyd '}{' '}
            <a href='#' onClick={changeLanguage} lang='en' rel='alternate' className='govuk-link'>
              yn Saesneg (English).
            </a>
          </>
        )}
      </div>
      <Button
        id='continueToPortal'
        onClick={e => {
          e.preventDefault();
          navigate('/registration');
        }}
        variant='start'
        data-prevent-double-click='true'
      >
        {t('START_NOW')}
      </Button>
    </>
  );
}

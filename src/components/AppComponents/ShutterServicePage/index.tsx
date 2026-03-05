import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import i18n from 'i18next';

export default function ShutterServicePage() {
  const { t } = useTranslation();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  const helpUrl =
    i18n.language === 'en'
      ? 'https://www.gov.uk/government/organisations/hm-revenue-customs/contact/income-tax-enquiries-for-individuals-pensioners-and-employees'
      : 'https://www.gov.uk/find-hmrc-contacts/treth-incwm-hunanasesiad-a-mwy';

  useEffect(() => {
    setPageTitle();
  }, [lang]);

  return (
    <MainWrapper showPageNotWorkingLink={false}>
      <h1 className='govuk-heading-l'>{t('SHUTTER_SERVICE_UNAVAILABLE')}</h1>
      <p className='govuk-body'>{t('SHUTTER_USE_SERVICE_LATER_MESSAGE')}</p>
      <p className='govuk-body'>
        <a href={helpUrl} rel='noreferrer noopener' target='_blank' className='govuk-link'>
          {t('CONTACT_INCOME_TAX_HELPLINE')}
        </a>{' '}
        {t('IF_YOU_NEED_MORE_HELP')}
      </p>
    </MainWrapper>
  );
}

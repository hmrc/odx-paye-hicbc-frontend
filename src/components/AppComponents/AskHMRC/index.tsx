import { useTranslation } from 'react-i18next';

const AskHMRC = () => {
  const { t, i18n } = useTranslation();

  const helpUrl =
    i18n.language === 'en'
      ? 'https://www.gov.uk/government/organisations/hm-revenue-customs/contact/income-tax-enquiries-for-individuals-pensioners-and-employees'
      : 'https://www.gov.uk/find-hmrc-contacts/treth-incwm-hunanasesiad-a-mwy';

  return (
    <>
      <hr aria-hidden='true' className='govuk-section-break govuk-section-break--l govuk-section-break--visible'></hr>
      <h2 className='govuk-heading-m'>{t('GET_HELP')}</h2>
      <div className='govuk-body'>
        <p>
          <a href={helpUrl} rel='noreferrer noopener' target='_blank' className='govuk-link'>
            {t('CONTACT_INCOME_TAX_HELPLINE')}
          </a>{' '}
          {t('IF_YOU_NEED_MORE_HELP')}
        </p>
      </div>
    </>
  );
};

export default AskHMRC;

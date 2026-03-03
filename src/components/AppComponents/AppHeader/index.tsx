import { useTranslation } from 'react-i18next';
import LanguageToggle from '../LanguageToggle';
import GOVUKHeader from '../GOVUKHeader';
import PhaseBanner from '../PhaseBanner';
import ServiceNavigation from '../ServiceNavigation';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';

export default function AppHeader(props) {
  const { handleSignout, appname, hasLanguageToggle, languageToggleCallback } = props;
  const { hmrcURL } = useHMRCExternalLinks();
  const { t } = useTranslation();
  const urlSkipContent = `${window.location.pathname}#main-content`;
  const url = window.location.toString()
  const registrationUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}registration`;

  return (
    <>
      <a href={urlSkipContent} className='govuk-skip-link' data-module='govuk-skip-link'>
        {t('SKIP_TO_MAIN')}
      </a>
      <header role='banner'>
        <GOVUKHeader handleSignout={handleSignout} />
        <ServiceNavigation name={appname} link={registrationUrl} />
        <PhaseBanner phase={t('BETA')} hyperlink={`${hmrcURL}contact/beta-feedback?service=SCAHICBC&referrerUrl=${window.location}`} />
        {hasLanguageToggle && (
          <div className='govuk-width-container'>
            <LanguageToggle languageToggleCallback={languageToggleCallback} />
          </div>
        )}
      </header>
    </>
  );
}

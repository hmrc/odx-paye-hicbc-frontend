import { useTranslation } from 'react-i18next';

interface PhaseBannerProps {
  phase: string;
  hyperlink: string;
}

const PhaseBanner = (props: PhaseBannerProps) => {
  const { t } = useTranslation();
  return (
    <div className='govuk-width-container'>
      <div className='govuk-phase-banner'>
        <p className='govuk-phase-banner__content'>
          <strong className='govuk-tag govuk-phase-banner__content__tag'>{props.phase}</strong>
          <span className='govuk-phase-banner__text'>
            {`${t('NEW_SERVICE')} - ${t('BANNER_FEEDBACK_1')} `}
            <a className='govuk-link' href={props.hyperlink} target='_blank' rel='noreferrer'>
              {t('BANNER_FEEDBACK_LINK')}
            </a>
            {` ${t('BANNER_FEEDBACK_2')}`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PhaseBanner;

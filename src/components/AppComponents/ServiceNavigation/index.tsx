import { getCurrentLanguage } from '../../helpers/utils';

interface ServiceNavigationProps {
  name: string;
  link: string;
}

const ServiceNavigation = (props: ServiceNavigationProps) => {
  const lang = getCurrentLanguage();

  return (
    <section
      className='govuk-service-navigation'
      data-module='govuk-service-navigation'
      aria-label={lang === 'en' ? 'Service information' : 'Gwybodaeth gwasanaeth'}
    >
      <div className='govuk-width-container'>
        <div className='govuk-service-navigation__container'>
          <span className='govuk-service-navigation__service-name'>
            <a href={props.link} className="govuk-service-navigation__link">
              {props.name}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServiceNavigation;

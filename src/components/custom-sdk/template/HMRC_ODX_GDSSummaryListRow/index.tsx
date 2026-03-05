import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isSingleEntity } from '../../../helpers/utils';

export default function HmrcOdxGdsSummaryListRow(props) {
  const { children, getPConnect } = props;

  const pConn = getPConnect();
  const containerItemID = pConn.getContextName();
  const { t } = useTranslation();
  const [pageReference, setPageReference] = useState('');

  const [pageValues, setPageValues] = useState<any>({});
  useEffect(() => {
    const region = children[0] ? children[0].props.getPConnect() : null;
    setPageReference(region.getPageReference());
  }, [children[0]]);

  useEffect(() => {
    setPageValues(PCore.getStoreValue(pageReference, '', pConn.getContextName()));
  }, [pageReference]);

  const handleOnClick = (event, action: string) => {
    event.preventDefault();
    switch (action) {
      case t('remove'):
        getPConnect().setValue('.UserActions', 'Remove');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      case t('change'):
        getPConnect().setValue('.UserActions', 'Amend');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      default:
        break;
    }
  };

  const hiddenText = pageValues?.SummaryListActionLinkHiddenText ?? pageValues.SummaryListValue;

  return (
    <div className='govuk-summary-list__row'>
      <dt className='govuk-summary-list__key govuk-!-font-weight-regular'>{pageValues?.SummaryListValue}</dt>
      <dd className='govuk-summary-list__actions'>
        {isSingleEntity(pageReference, getPConnect) ? (
          <a className='govuk-link' href='#' onClick={e => handleOnClick(e, 'change')}>
            {t('GDS_ACTION_CHANGE')}
            <span className='govuk-visually-hidden'>{hiddenText}</span>
          </a>
        ) : (
          <ul className='govuk-summary-list__actions-list'>
            <li className='govuk-summary-list__actions-list-item'>
              <a className='govuk-link' href='#' onClick={e => handleOnClick(e, 'remove')}>
                {t('GDS_ACTION_REMOVE')}
                <span className='govuk-visually-hidden'>{hiddenText}</span>
              </a>
            </li>
            <li className='govuk-summary-list__actions-list-item'>
              <a className='govuk-link' href='#' onClick={e => handleOnClick(e, 'change')}>
                {t('GDS_ACTION_CHANGE')}
                <span className='govuk-visually-hidden'>{hiddenText}</span>
              </a>
            </li>
          </ul>
        )}
      </dd>
    </div>
  );
}

HmrcOdxGdsSummaryListRow.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired
};

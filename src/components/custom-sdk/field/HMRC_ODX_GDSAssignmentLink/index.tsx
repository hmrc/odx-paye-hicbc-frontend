import React, { MouseEvent } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
// import GBdateFullMonthName from './utils';
// import store from '../../../helpers/Redux/store';
import { getServiceShutteredStatus, scrollToTop } from '../../../helpers/utils';
// import { setServiceError } from '../../../helpers/Redux/actions';
// import { t } from 'i18next';

interface HmrcOdxGdsAssignmentLinkProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
  label: string;
  value: string;
  stepId: string;
  testID: string;
  prefixLabel: string;
  suffixLabel: string;
  valueType: string;
  linkAction: string;
}

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsAssignmentLink(props: HmrcOdxGdsAssignmentLinkProps) {
  const {
    getPConnect,
    label,
    value,
    stepId,
    testID,
    prefixLabel,
    suffixLabel,
    valueType,
    linkAction = '1'
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const containerItemID = pConn.getContextName();
  // const appName = store.getState().appName;

  const navigateStep = async () => {
    if (linkAction === 'NAVIGATE_TO_STEP') {
      const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

      navigateToStepPromise
        .then(() => {
          //  navigate to step success handling
          console.log('navigation successful'); // eslint-disable-line
        })
        .catch((error: any) => {
          // navigate to step failure handling
          // eslint-disable-next-line no-console
          console.log('Change link Navigation failed', error);
          PCore.getPubSubUtils().publish('APIError', {});
        });
    } else {
      const status = await getServiceShutteredStatus();
      if (status) {
        PCore.getPubSubUtils().publish('shutterServiceEnabled', {});
      } else {
        pConn.setValue('.NextStep', stepId, '', false);
        actions
          .finishAssignment(containerItemID)
          .then(() => {
            scrollToTop();
          })
          .catch(() => {
            scrollToTop();
            PCore.getPubSubUtils().publish('APIError', {});
          });
      }
    }
  };
  const handleOnClick = (event: MouseEvent) => {
    event.preventDefault();
    navigateStep();
  };

  const handleOnClickRefNo = (event: MouseEvent, labelText) => {
    event.preventDefault();
    sessionStorage.removeItem('isCaseSaved');
    getPConnect().setValue('.ReactParamVal', labelText, '', false);
    navigateStep();
  };

  const renderLabel = () => {
    if (valueType === '2') {
      // Display Date type
      return <>{label}</>;
    } else {
      return (
        <a href='#' className='govuk-link' onClick={handleOnClick}>
          {/* {getLocalizedValue(label, 'Value')} */}
          {label}
        </a>
      );
    }
  };

  return (
    <>
      {valueType === '3' ? (
        <a href='#' className='govuk-link' onClick={event => handleOnClickRefNo(event, value)}>
          {value}
        </a>
      ) : (
        <div
          className='govuk-body  assignment-link'
          style={{ display: 'flex', gap: '20px' }}
          data-test-id={testID}
        >
          <span>
            {prefixLabel}
            {/* {prefixLabel} */}
            {label && renderLabel()}
            {/* {suffixLabel} */}
            {suffixLabel}
          </span>
        </div>
      )}
    </>
  );
}

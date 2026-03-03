import React, { MouseEvent } from 'react';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
// import GBdateFullMonthName from './utils';

interface HmrcOdxGdsAssignmentLinkProps extends PConnFieldProps {
  // If any, enter additional props that only exist on this componentName
  label: string;
  stepId: string;
  testID: string;
  prefixLabel: string;
  suffixLabel: string;
  valueType: string;
}

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsAssignmentLink(props: HmrcOdxGdsAssignmentLinkProps) {
  const { getPConnect, label, stepId, testID, prefixLabel, suffixLabel, valueType } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();

  const containerItemID = pConn.getContextName();

  const navigateStep = () => {
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
      });
  };
  const handleOnClick = (event: MouseEvent) => {
    event.preventDefault();
    navigateStep();
  };

  const handleOnClickRefNo = (event: MouseEvent, labelText) => {
    event.preventDefault();
    getPConnect().setValue('.ReactParamVal', labelText, '', false);
    navigateStep();
  };

  const renderLabel = () => {
    if (valueType === '2') {
      // Display Date type
      return <>{label}</>;
    }
    if (valueType === '3') {
      // Handle Reference No click (for BPP)
      return (
        <a href='#' className='govuk-link' onClick={event => handleOnClickRefNo(event, label)}>
          {label}
        </a>
      );
    } else {
      return (
        <a href='#' className='govuk-link' onClick={handleOnClick}>
          {label}
        </a>
      );
    }
  };

  return (
    <div className='govuk-body' style={{ display: 'flex', gap: '20px' }} data-test-id={testID}>
      <span>
        {prefixLabel}
        {renderLabel()}
        {suffixLabel}
      </span>
    </div>
  );
}

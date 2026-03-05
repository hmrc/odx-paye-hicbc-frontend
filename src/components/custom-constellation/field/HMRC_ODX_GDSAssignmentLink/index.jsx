import GBdateFullMonthName from './utils';

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsAssignmentLink(props)  {
  const { getPConnect, label,value, stepId, testID, prefixLabel, suffixLabel, valueType, linkAction = '1' } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const containerItemID = pConn.getContextName();

  const navigateStep = () => {
    if (linkAction === '1') {
      const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

      navigateToStepPromise
        .then(() => {
          //  navigate to step success handling
          console.log('navigation successful'); // eslint-disable-line
        })
        .catch((error) => {
          // navigate to step failure handling
          // eslint-disable-next-line no-console
          console.log('Change link Navigation failed', error);
        });
    } else {
      pConn.setValue('.NextStep', stepId, '', false);
      actions.finishAssignment(containerItemID);
    }
  };
  const handleOnClick = (event) => {
    event.preventDefault();
    navigateStep();
  };

  const handleOnClickRefNo = (event, labelText) => {
    event.preventDefault();
    sessionStorage.removeItem('isCaseSaved');
    getPConnect().setValue('.ReactParamVal', labelText, '', false);
    navigateStep();
  };

  const renderLabel = () => {
    if (valueType === '2') {
      // Display Date type
      return <>{GBdateFullMonthName(label)}</>;
    } else {
      return (
        <a href='#' className='govuk-link' onClick={handleOnClick}>
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
            {label && renderLabel()}
            {suffixLabel}
          </span>
        </div>
      )}
    </>
  );
}


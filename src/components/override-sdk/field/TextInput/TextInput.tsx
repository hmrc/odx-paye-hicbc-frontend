import React, { useContext, useEffect, useState } from 'react';
import { TextInput as GDSTextInput } from 'hmrc-gds-react-components';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer/index';
import { ReadOnlyDefaultFormContext } from '../../../helpers/HMRCAppContext';
import { checkErrorMsgs, checkStatus } from '../../../helpers/utils';
import maxLengthToInputWidthClass from '../../../helpers/MaxLengthToInputWidthClass';
import { ErrorMsgContext } from '../../../helpers/HMRCAppContext';
import { useTranslation } from 'react-i18next';

const buildExtraProps = (onChange, value, fieldMetadata, configAlternateDesignSystem) => {
  const extraInputProps: {
    onChange: React.ChangeEvent<HTMLInputElement>;
    value: string;
    type?: string;
    autoComplete?: string;
    inputMode?: string;
  } = {
    onChange,
    value
  };

  // TODO Investigate more robust way to check if we should display as password
  if (fieldMetadata?.displayAs === 'pxPassword') {
    extraInputProps.type = 'password';
  }

  if (fieldMetadata?.displayAs === 'pxEmail') {
    extraInputProps.type = 'email';
    // eslint-disable-next-line @typescript-eslint/dot-notation
    extraInputProps['spellcheck'] = 'false';
  }

  if (fieldMetadata?.displayAs === 'pxPhone') {
    extraInputProps.type = 'tel';
  }

  if (configAlternateDesignSystem?.autocomplete) {
    extraInputProps.autoComplete = configAlternateDesignSystem.autocomplete;
  } else {
    extraInputProps.autoComplete = 'off';
  }

  return extraInputProps;
};

export default function TextInput(props) {
  const {
    getPConnect,
    value = '',
    placeholder,
    validatemessage,
    onChange,
    helperText,
    inputProps,
    fieldMetadata,
    readOnly,
    disabled,
    name,
    testId,
    configAlternateDesignSystem
  } = props;

  const { errorMsgs } = useContext(ErrorMsgContext);

  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const { t } = useTranslation();

  const isComplexQuestionPage = PCore.getStoreValue('isComplexQuestionPage', '', 'app');

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  // @ts-ignore
  const [errorMessage, setErrorMessage] = useState(localizedVal(validatemessage));

  registerNonEditableField(!!disabled);

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();

  const propName = thePConn.getStateProps().value;
  const fieldId = props.isExtendedDate ? props.fieldId : propName?.split('.')?.pop();
  const formattedPropertyName = name || fieldId;

  useEffect(() => {
    const found = checkErrorMsgs(errorMsgs, fieldId, formattedPropertyName);
    if (!found) {
      setErrorMessage(validatemessage);
    } else {
      setErrorMessage(found.message.message);
    }
  }, [validatemessage, errorMsgs]);

  const handleChange = evt => {
    if (name === 'content-pyPostalCode') {
      const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
      handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
    }
  };

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const maxLength = props?.maxLength ?? fieldMetadata?.maxLength; // For Extended Date Component
  const inprogressStatus = checkStatus();

  if (hasBeenWrapped && configAlternateDesignSystem?.ShowChangeLink && inprogressStatus === 'Open-InProgress') {
    return (
      <GDSCheckAnswers
        label={props.label}
        value={value}
        name={name}
        stepId={configAlternateDesignSystem.stepId}
        hiddenText={configAlternateDesignSystem.hiddenText}
        getPConnect={getPConnect}
        required={false}
        disabled={false}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        helperText={helperText}
        hideLabel={false}
        placeholder={placeholder}
      />
    );
  }

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={value} name={name} />;
  }

  const extraProps = { testProps: { 'data-test-id': testId } };

  const extraInputProps = buildExtraProps(onChange, value, fieldMetadata, configAlternateDesignSystem);

  const keyHandler = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // For Extended Date Component
  if (props.isExtendedDate) {
    let cssName: string = maxLengthToInputWidthClass(maxLength);
    if (props.isExtendedDate && !props.showErrors && validatemessage) {
      cssName = `${props.className} govuk-input--error`;
    }
    extraInputProps.inputMode = props.inputMode;
    extraInputProps.type = props.type;
    extraInputProps.autoComplete = 'on';
    return (
      <GDSTextInput
        inputProps={{
          ...inputProps,
          ...extraInputProps,
          'data-test-id': testId,
          onKeyDown: keyHandler,
          className: cssName
        }}
        hintText={helperText}
        errorText='' // Hide the error message above the input field when using Extended Date Component
        label={label}
        labelIsHeading={isOnlyField}
        name={formattedPropertyName}
        id={fieldId}
        onBlur={e => handleChange(e)}
        errorPrefix={t('ERROR')}
      />
    );
  }

  return (
    <GDSTextInput
      inputProps={{
        ...inputProps,
        ...extraInputProps
      }}
      hintText={helperText}
      labelClasses={isComplexQuestionPage ? 'govuk-label--m' : ''}
      errorText={errorMessage}
      label={label}
      labelIsHeading={isOnlyField}
      name={formattedPropertyName}
      maxLength={maxLength}
      id={fieldId}
      onBlur={e => handleChange(e)}
      {...extraProps}
      disabled={disabled || false}
      errorPrefix={t('ERROR')}
    />
  );
}

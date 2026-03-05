import React from 'react';
import PropTypes from 'prop-types';
import FormGroup, { makeErrorId, makeHintId } from '../FormGroup/FormGroup';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

export default function TextArea(props) {
  const { name, errorText, hintText, inputProps = {}, maxLength, fieldId, onBlur, disabled, rows = 5 } = props;

  if (disabled) {
    return (
      <>
        {hintText && (
          <div id={makeHintId(name)} className='govuk-hint'>
            <HintTextComponent htmlString={hintText} />
          </div>
        )}
        <span className='govuk-body govuk-!-font-weight-bold read-only'>{inputProps.value}</span>
        <br />
      </>
    );
  }

  const inputClasses = `govuk-textarea ${errorText ? 'govuk-textarea--error' : ''}`.trim();

  const describedByIDs = `${hintText ? makeHintId(name) : ''} ${errorText ? makeErrorId(name) : ''}`.trim();
  if (describedByIDs.length !== 0) {
    inputProps['aria-describedby'] = describedByIDs;
  }

  return (
    <FormGroup {...props}>
      <textarea className={inputClasses} {...inputProps} id={fieldId} name={name} onBlur={onBlur} maxLength={maxLength} rows={rows}>
        {inputProps.value}
      </textarea>
    </FormGroup>
  );
}

TextArea.propTypes = {
  ...FormGroup.propTypes,
  name: PropTypes.string,
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  inputProps: PropTypes.object,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func
};

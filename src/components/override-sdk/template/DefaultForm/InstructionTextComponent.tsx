import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import getFormattedInstructionText from './DefaultFormUtils';

export default function InstructionTextComponent({ instructionText }) {
  return (
    <div className='govuk-body instructions'>
      <ParsedHTML htmlString={getFormattedInstructionText(instructionText)} />
    </div>
  );
}

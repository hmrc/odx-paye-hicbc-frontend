function maxLengthToInputWidthClass(maxLength: string): string {
  const parsedMaxLength = parseInt(maxLength, 10);
  if (parsedMaxLength) {
    if (parsedMaxLength <= 2) {
      return 'govuk-input--width-2';
    } else if (parsedMaxLength === 3) {
      return 'govuk-input--width-3';
    } else if (parsedMaxLength === 4) {
      return 'govuk-input--width-4';
    } else if (parsedMaxLength === 5) {
      return 'govuk-input--width-5';
    } else if (parsedMaxLength > 5 && parsedMaxLength <= 10) {
      return 'govuk-input--width-10';
    } else if (parsedMaxLength > 10 && parsedMaxLength <= 20) {
      return 'govuk-input--width-20';
    }
  }
  return '';
}

export default maxLengthToInputWidthClass;

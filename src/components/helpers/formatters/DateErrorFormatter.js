import i18n from 'i18next';
import { getWorkareaContainerName } from './../utils';

// eslint-disable-next-line sonarjs/cognitive-complexity
const _DateErrorFormatter = (message, propertyName = '') => {
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];

  const containerName = getWorkareaContainerName();
  const formEditablefields = PCore?.getFormUtils()?.getEditableFields(containerName);
  const formFields = formEditablefields?.filter(field => field.label === propertyName);
 // let langLabelKey = formFields[0]?.fieldC11nEnv?.getStateProps()?.value?.split('.')?.pop();
  let langLabelKey = formFields[0]?.name?.split('.')?.pop();
  langLabelKey = langLabelKey?.replace(' ', '_')?.toUpperCase();

  // LINE 16-23 IS CUSTOM FUNCTIONALITY
  if (message !== undefined && message !== '') {
    const justDate = message.replace(' is not a valid date value', '');

    // If error message is already correct from Pega, just forward it.
    if (!((justDate.match(/-/g) || []).length >= 2)) {
      // If there isn't two or more dashes, it isn't the default error. Pass down Pega's error.
      return {
        message,
        targets
      };
    }

    if (justDate.replaceAll(/[0-9]/g, '') !== '--') {
      // If not blank, remove the "is not a valid date value" and all numbers. If anything other than the two dashes are there, it must be an invalid character as anything valid has been removed.
      return {
        message: `${i18n.t(langLabelKey)} ${i18n.t('MUST_BE_A_REAL_DATE')}`,
        targets
      };
    }
  }

  if (originalDate) {
    const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = '';
    if (day === '') {
      missingPartMessage += ` ${i18n.t('A_DAY')}`;
      targets.push('day');
    }
    if (month === '') {
      if (missingPartMessage.length > 0) missingPartMessage += i18n.t('AND_MONTH');
      else missingPartMessage += i18n.t('A_MONTH');
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += ` ${i18n.t('AND_YEAR')}`;
      else missingPartMessage += ` ${i18n.t('A_YEAR')}`;
      targets.push('year');
    }
    const shortPropertyName = i18n.t('DATE');

    if (missingPartMessage.length > 0) {
      if (langLabelKey) {
        return {
          message: `${i18n.t(langLabelKey)} ${i18n.t('MUST_INCLUDE')} ${missingPartMessage}`,
          targets
        };
      } else {
        return {
          message: `${shortPropertyName} ${i18n.t('MUST_INCLUDE')} ${missingPartMessage}`,
          targets
        };
      }
    }

    // LINE 60-66 IS CUSTOM FUNCTIONALITY
    if (year.match(/(^\d+$)/) && year.length !== 4) {
      // If year is a number, and it is not 4 digits, return this error.
      return {
        message: `${i18n.t('MUST_INCLUDE_4_NUMBERS')}`,
        targets
      };
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      if (langLabelKey) {
        return {
          message: `${i18n.t(langLabelKey)} ${i18n.t('MUST_BE_A_REAL_DATE')} `,
          targets
        };
      } else {
        return { message: `${shortPropertyName} ${i18n.t('MUST_BE_A_REAL_DATE')} `, targets };
      }
    }
  }
  return { message, targets };
};

export const DateErrorFormatter = (message, propertyName) => {
  if (propertyName === ' ') propertyName = i18n.t('DATE_OF_BIRTH');
  return _DateErrorFormatter(message, propertyName).message;
};

export const DateErrorTargetFields = message => {
  return _DateErrorFormatter(message).targets;
};

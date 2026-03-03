import { useState } from 'react';
import HmrcOdxGdsAssignmentLink from './index.tsx';
import { withKnobs } from '@storybook/addon-knobs';
import { configProps } from './mock.stories';

export default {
  title: 'HmrcOdxGdsAssignmentLink',
  decorators: [withKnobs],
  component: HmrcOdxGdsAssignmentLink
};

export const BaseHmrcOdxGdsAssignmentLink = () => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    helperText: configProps.helperText,
    disabled: configProps.disabled,
    required: configProps.required,
    readOnly: configProps.readOnly,
    prefixLabel: configProps.prefixLabel,
    suffixLabel: configProps.suffixLabel,
    displayMode: configProps.displayMode,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: (propName, theValue) => {
              setValue(theValue);
            }
          };
        },
        getStateProps: () => {
          return { value: '.name' };
        },
        getContextName: () => {
          return { value: 'caseinfo' };
        }
      };
    },
    onChange: event => {
      setValue(event.target.value);
    },
    onBlur: () => {
      return configProps.value;
    }
  };

  return <HmrcOdxGdsAssignmentLink {...props} />;
};

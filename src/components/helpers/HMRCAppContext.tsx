import { createContext } from 'react';

export interface ErrorMessage {
  fieldId?: string;
  message?: string;
  pageReference?: string;
  propertyName?: string;
}

export interface Errors {
  displayOrder: number;
  message: ErrorMessage;
}

const DefaultFormContext = createContext({
  // Is this Default Form set to display as single question?
  displayAsSingleQuestion: false,
  // What is the name of this Default Form (should be same as name pushed to HMRCAppContext SingleQuestionDisplayDFStack)
  DFName: -1,
  // Holds assignment name incase needed for single page label
  OverrideLabelValue: '',

  // Holds DefaultForm level instruction text for use in field set instruction blocks
  instructionText: ''
});

const ErrorMsgContext = createContext({
  errorMsgs: []
});

const ReadOnlyDefaultFormContext = createContext({
  hasBeenWrapped: false
});

const GroupContext = createContext({
  setErrorMessage: null
});

export { DefaultFormContext, ReadOnlyDefaultFormContext, ErrorMsgContext, GroupContext };

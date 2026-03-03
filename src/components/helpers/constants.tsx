export const TIMEOUT_115_SECONDS = 115 * 1000;
export const TIMEOUT_13_MINUTES = 780 * 1000;

const apiConfig = {
  registration: {
    shuttering: {
      featureID: 'HICBC'
    },
    application: 'HICBC',
    autoSignoutApplication: 'HICBCRegistrationTimeOut'
  }
};

export default apiConfig;

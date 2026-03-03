import getPageDataAsync from './getPageDataAsync';

interface DataPageResponse {
  IsNormalAuthentication?: boolean;
  PostAuthAction?: string;
}

const TensCheckRequired = async (): Promise<boolean> => {
  const dataResponse: DataPageResponse = await getPageDataAsync({
    pageName: 'D_PostCitizenAuthAction'
  });
  return dataResponse?.IsNormalAuthentication === false && dataResponse?.PostAuthAction === 'TENS';
};

async function checkAuthAndRedirectIfTens(): Promise<boolean> {
  const TENS_REDIRECT_URL = 'https://www.tax.service.gov.uk/protect-tax-info';

  if (localStorage.getItem('tensCheckCarriedOut') === 'true') {
    // After the redirect from TENS
    localStorage.removeItem('tensCheckCarriedOut');
    return false;
  }

  const TensRequired = await TensCheckRequired();

  if (TensRequired) {
    localStorage.setItem('tensCheckCarriedOut', 'true');
    const currentPage = window.location.href;
    window.location.replace(`${TENS_REDIRECT_URL}?redirectUrl=${encodeURIComponent(currentPage)}`); // This will not work in Dev as this is only available in prod
  }
  return TensRequired;
}

export default checkAuthAndRedirectIfTens;

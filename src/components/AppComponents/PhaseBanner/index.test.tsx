import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { mockGetSdkConfigWithBasepath } from '../../../../tests/mocks/getSdkConfigMock';
import PhaseBanner from '.';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('should render', () => {
  let t;
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();
  });

  it('should render the phase banner content with appropriate text in English.', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <PhaseBanner
            phase='Beta'
            hyperlink='https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=SCAHICBC&referrerUrl=http://localhost:3502/registration'
          />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('feedback (opens in new tab)')).toBeInTheDocument();
  });

  it('should render the phase banner content with appropriate text in Welsh.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <PhaseBanner
            phase='Beta'
            hyperlink='https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=SCAHICBC&referrerUrl=http://localhost:3502/registration'
          />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('adborth (yn agor tab newydd)')).toBeInTheDocument();
  });

  it('should navigate to appropriate page when link is clicked.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <PhaseBanner
            phase='Beta'
            hyperlink='https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=SCAHICBC&referrerUrl=http://localhost:3502/registration'
          />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('link', { name: 'feedback (opens in new tab)' })).toHaveAttribute(
      'href',
      'https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=SCAHICBC&referrerUrl=http://localhost:3502/registration'
    );
  });
});

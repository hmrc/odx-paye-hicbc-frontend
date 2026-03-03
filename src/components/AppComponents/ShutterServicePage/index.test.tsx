import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import ShutterServicePage from '.';
import setPageTitle from '../../helpers/setPageTitleHelpers';
import { mockGetSdkConfigWithBasepath } from '../../../../tests/mocks/getSdkConfigMock';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { act } from 'react-dom/test-utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('../../helpers/setPageTitleHelpers', () => jest.fn());

describe('ShutterServicePage', () => {
  let t;
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();

    const { result } = renderHook(() => useHMRCExternalLinks());

    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcUrlMigrated = 'https://test-www.tax.service.gov.uk/';
    });
  });

  test('renders the component successfully', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ShutterServicePage />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sorry, the service is unavailable');
    expect(screen.getByText('This service is temporarily offline for scheduled maintenance, please come back later.')).toBeInTheDocument();
    expect(screen.getByText('Contact the Income Tax helpline (opens in new tab)')).toBeInTheDocument();
  });

  test('calls setPageTitle on mount', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ShutterServicePage />
        </I18nextProvider>
      );
    });
    expect(setPageTitle).toHaveBeenCalled();
  });

  test('renders with the correct language based on sessionStorage', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ShutterServicePage />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mae’n ddrwg gennym, nid yw’r gwasanaeth ar gael ar hyn o bryd');
    expect(
      screen.getByText(
        'Mae’r gwasanaeth hwn all-lein am gyfnod dros dro ar gyfer gwaith cynnal a chadw sydd wedi’i drefnu. Dewch yn ôl yn nes ymlaen.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Cysylltwch â Gwasanaeth Cwsmeriaid Cymraeg CThEF (yn agor tab newydd)')).toBeInTheDocument();
  });

  it('should navigate to appropriate income tax helpline page when link is clicked in English.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ShutterServicePage />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('link', { name: 'Contact the Income Tax helpline (opens in new tab)' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/government/organisations/hm-revenue-customs/contact/income-tax-enquiries-for-individuals-pensioners-and-employees'
    );
  });

  it('should navigate to appropriate income tax helpline page when link is clicked in Welsh.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ShutterServicePage />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('link', { name: 'Cysylltwch â Gwasanaeth Cwsmeriaid Cymraeg CThEF (yn agor tab newydd)' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/find-hmrc-contacts/treth-incwm-hunanasesiad-a-mwy'
    );
  });
});

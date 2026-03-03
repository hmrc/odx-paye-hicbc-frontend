import AskHMRC from '.';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../tests/mocks/getSdkConfigMock';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('../../helpers/utils', () => ({
  getAskHmrcSubLink: jest.fn().mockReturnValue('self-assessment-cessation')
}));

describe('should render component AskHMRC.', () => {
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

  it('should render income tax helpline content in English.', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AskHMRC />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Get help')).toBeInTheDocument();
    expect(screen.getByText('Contact the Income Tax helpline (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByText('if you need more help.')).toBeInTheDocument();
  });

  it('should render income tax helpline content in Welsh.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AskHMRC />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Cael help')).toBeInTheDocument();
    expect(screen.getByText('Cysylltwch â Gwasanaeth Cwsmeriaid Cymraeg CThEF (yn agor tab newydd)')).toBeInTheDocument();
    expect(screen.getByText('os oes angen rhagor o help arnoch.')).toBeInTheDocument();
  });

  it('should navigate to appropriate income tax helpline page when link is clicked in English.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AskHMRC />
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
          <AskHMRC />
        </I18nextProvider>
      );
    });

    expect(screen.getByRole('link', { name: 'Cysylltwch â Gwasanaeth Cwsmeriaid Cymraeg CThEF (yn agor tab newydd)' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/find-hmrc-contacts/treth-incwm-hunanasesiad-a-mwy'
    );
  });
});

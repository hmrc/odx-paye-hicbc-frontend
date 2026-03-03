import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import GOVUKHeader from '.';
import LanguageToggle from '.';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const languageToggleCallback = jest.fn();

describe('should render', () => {
  let t;
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
  });

  it('should render the content with appropriate text.', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <LanguageToggle languageToggleCallback={languageToggleCallback} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Cymraeg')).toBeInTheDocument();
  });

  it('should execute language toggle callback on click.', async () => {
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');

      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <LanguageToggle languageToggleCallback={languageToggleCallback} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Cymraeg')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cymraeg'));
    expect(languageToggleCallback).toHaveBeenCalled();
  });

  it('should change language from Welsh to English on click', async () => {
    t.result.current.i18n.changeLanguage('cy');

    render(
      <I18nextProvider i18n={t.result.current.i18n}>
        <LanguageToggle languageToggleCallback={languageToggleCallback} />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText('English'));

    expect(document.documentElement.lang).toBe('en');
  });

  it('should change language from English to Welsh on click', async () => {
    t.result.current.i18n.changeLanguage('en');

    render(
      <I18nextProvider i18n={t.result.current.i18n}>
        <LanguageToggle languageToggleCallback={languageToggleCallback} />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByText('Cymraeg'));

    expect(document.documentElement.lang).toBe('cy');
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import Button from './Button';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const defaultProps = {
  false: false,
  id: 'button',
  variant: 'start',
  onClick: jest.fn(),
  children: 'Example',
  attributes: { className: 'example' }
};

describe('Button', () => {
  let t;
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
  });

  it('start variant should render children.', async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...defaultProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('link variant should render children.', async () => {
    const props = defaultProps;
    props.variant = 'link';
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('backlink variant should render children.', async () => {
    const props = defaultProps;
    props.variant = 'backlink';
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('backlink variant should render back when no children are present.', async () => {
    const props = {
      false: false,
      id: 'button',
      variant: 'backlink',
      onClick: jest.fn(),
      attributes: { className: 'example' }
    };
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('start variant should run handler when clicked.', async () => {
    const props = defaultProps;
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });

    fireEvent.click(screen.getByText('Example'));
    expect(props.onClick).toHaveBeenCalled();
  });

  it('link variant should run handler when clicked.', async () => {
    const props = defaultProps;
    props.variant = 'link';
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });
    fireEvent.click(screen.getByText('Example'));
    expect(props.onClick).toHaveBeenCalled();
  });

  it('backlink variant should run handler when clicked.', async () => {
    const props = defaultProps;
    props.variant = 'backlink';
    await act(async () => {
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <Button {...props} />
        </I18nextProvider>
      );
    });
    fireEvent.click(screen.getByText('Example'));
    expect(props.onClick).toHaveBeenCalled();
  });
});

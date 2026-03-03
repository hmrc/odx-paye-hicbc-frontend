import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import ServiceNavigation from '.';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('ServiceNavigation', () => {
  afterEach(cleanup);

  it('should render the service navigation content with appropriate text.', async () => {
    await act(async () => {
      render(<ServiceNavigation link='/registration' name='Pay the High Income Child Benefit Charge via PAYE' />);
    });

    expect(screen.getByText('Pay the High Income Child Benefit Charge via PAYE')).toBeInTheDocument();
  });

  it('should direct user to main service URL when clicked.', async () => {
    await act(async () => {
      render(<ServiceNavigation link='/registration' name='Pay the High Income Child Benefit Charge via PAYE' />);
    });

    expect(screen.getByRole('link', { name: 'Pay the High Income Child Benefit Charge via PAYE' })).toHaveAttribute('href', '/registration');
  });
});

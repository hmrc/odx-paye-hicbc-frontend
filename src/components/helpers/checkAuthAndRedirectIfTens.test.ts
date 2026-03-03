import checkAuthAndRedirectIfTens from './checkAuthAndRedirectIfTens';

describe('checkAuthAndRedirectIfTens', () => {
  const mockGetPageDataAsync = jest.fn();
  const mockRedirect = jest.fn();

  // local storage
  const mockGetItem = jest.fn();
  const mockSetItem = jest.fn();
  const mockRemoveItem = jest.fn();
  const currentPageURL = 'www.currentPageUrl.com';

  beforeEach(() => {
    // Mocking PCore.getDataPageUtils().getPageDataAsync
    (window as any).PCore = {
      getDataPageUtils: jest.fn(() => ({
        getPageDataAsync: mockGetPageDataAsync
      }))
    };

    // Mocking window.location.replace
    Object.defineProperty(window, 'location', {
      value: { replace: mockRedirect, href: currentPageURL },
      writable: true
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (...args: string[]) => mockGetItem(...args),
        setItem: (...args: string[]) => mockSetItem(...args),
        removeItem: (...args: string[]) => mockRemoveItem(...args)
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('Tens check carried out', () => {
    test('should redirect when IsNormalAuthentication is false and PostAuthAction is TENS', async () => {
      mockGetPageDataAsync.mockResolvedValue({
        IsNormalAuthentication: false,
        PostAuthAction: 'TENS'
      });
      jest.spyOn(window.localStorage, 'setItem');

      const result = await checkAuthAndRedirectIfTens();

      expect(mockSetItem).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith(`https://www.tax.service.gov.uk/protect-tax-info?redirectUrl=${currentPageURL}`);
      expect(localStorage.setItem).toHaveBeenCalledWith('tensCheckCarriedOut', 'true');
      expect(result).toBe(true);
    });

    test('should not redirect when IsNormalAuthentication is false and PostAuthAction is TENS and we have already done a tens check', async () => {
      mockGetPageDataAsync.mockResolvedValue({
        IsNormalAuthentication: false,
        PostAuthAction: 'TENS'
      });
      mockGetItem.mockReturnValue('true');

      const result = await checkAuthAndRedirectIfTens();

      expect(mockGetItem).toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('No tens check', () => {
    test('should not redirect if IsNormalAuthentication is true and PostAuthAction is not TENS', async () => {
      // Mock the response with IsNormalAuthentication === true
      mockGetPageDataAsync.mockResolvedValue({
        IsNormalAuthentication: true,
        PostAuthAction: 'Other'
      });

      const result = await checkAuthAndRedirectIfTens();

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test('should not redirect when IsNormalAuthentication is false and PostAuthAction is not TENS', async () => {
      mockGetPageDataAsync.mockResolvedValue({
        IsNormalAuthentication: false,
        PostAuthAction: 'Other'
      });

      const result = await checkAuthAndRedirectIfTens();

      expect(mockSetItem).not.toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test('should not redirect ifIsNormalAuthentication is true and PostAuthAction is TENS', async () => {
      mockGetPageDataAsync.mockResolvedValue({
        IsNormalAuthentication: true,
        PostAuthAction: 'TENS'
      });

      const result = await checkAuthAndRedirectIfTens();

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});

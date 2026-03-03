import { getJourneyName, setJourneyName } from './journeyRegistry';
import setPageTitle, { registerServiceName } from './setPageTitleHelpers';
import {
  checkErrorMsgs,
  formatDecimal,
  GBdate,
  getCurrentLanguage,
  getOrdinalSuffix,
  removeRedundantString,
} from './utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('utils tests', () => {
  describe('formatDecimal method test', () => {
    test('formatDecimal returns 1.05 when we pass "1.05"', () => {
      expect(formatDecimal('1.05')).toBe(1.05);
    });

    test('formatDecimal returns 1 when we pass "1.00"', () => {
      expect(formatDecimal('1.00')).toBe(1);
    });
  });

  describe('getOrdinalSuffix method test', () => {
    test('getOrdinalSuffix returns "0" when we pass 0', () => {
      expect(getOrdinalSuffix(0)).toBe('0');
    });

    test('getOrdinalSuffix returns ST when we pass 1', () => {
      expect(getOrdinalSuffix(1)).toBe('ST');
    });

    test('getOrdinalSuffix returns ND when we pass 2', () => {
      expect(getOrdinalSuffix(2)).toBe('ND');
    });

    test('getOrdinalSuffix returns RD when we pass 3', () => {
      expect(getOrdinalSuffix(3)).toBe('RD');
    });

    test('getOrdinalSuffix returns TH when we pass 4', () => {
      expect(getOrdinalSuffix(4)).toBe('TH');
    });

    test('getOrdinalSuffix returns TH when we pass 11', () => {
      expect(getOrdinalSuffix(11)).toBe('TH');
    });

    test('getOrdinalSuffix returns TH when we pass 12', () => {
      expect(getOrdinalSuffix(12)).toBe('TH');
    });

    test('getOrdinalSuffix returns TH when we pass 13', () => {
      expect(getOrdinalSuffix(13)).toBe('TH');
    });
  });
  describe('Page title tests', () => {
    test('Service name gets set correctly', () => {
      registerServiceName('Service');
      setPageTitle();
      expect(document.title).toBe('Service - GOV.UK');
    });

    beforeEach(() => {
      document.title = '';
      document.body.innerHTML = ''; // Reset DOM
      registerServiceName('');
    });

    test('sets page title correctly when one <h1> is present', () => {
      registerServiceName('Service');

      const h1 = document.createElement('h1');
      h1.innerText = 'Page Title';
      document.body.appendChild(h1);

      setPageTitle();

      jest.runOnlyPendingTimers();

      expect(document.title).toBe('Page Title - Service - GOV.UK');
    });

    test('sets error-prefixed title when errorProperty is true', () => {
      registerServiceName('Service');

      const h1 = document.createElement('h1');
      h1.innerText = 'Page Title';
      document.body.appendChild(h1);

      setPageTitle(true);

      jest.runOnlyPendingTimers();

      expect(document.title).toBe('Error: Page Title - Service - GOV.UK');
    });
  });

  describe('GBdate', () => {
    test('converts YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(GBdate('2025-10-30')).toBe('30/10/2025');
    });
    test('handles empty input', () => {
      expect(GBdate('')).toBe('');
    });
  });

  describe('checkErrorMsgs', () => {
    const errors = [{ message: { fieldId: 'name' } }, { message: { fieldId: 'nino' } }, { message: { fieldId: 'PartnershipStartDate-Day' } }];

    test('finds error by exact fieldIdentity match', () => {
      expect(checkErrorMsgs(errors, 'name')).toEqual({ message: { fieldId: 'name' } });
    });

    test('finds error by fieldElement prefix match', () => {
      expect(checkErrorMsgs(errors, '', 'PartnershipStartDate')).toEqual({ message: { fieldId: 'PartnershipStartDate-Day' } });
    });

    test('handles empty errorMsgs array', () => {
      expect(checkErrorMsgs([], 'name')).toBeUndefined();
    });
  });

  describe('journeyRegistry', () => {
    test('Get/Set Journey Name', () => {
      setJourneyName('Test');
      expect(getJourneyName()).toBe('Test');
    });
  });

  describe('removeRedundantString', () => {
    it('should remove duplicate segments separated by default "."', () => {
      const input = '1.2.1.3.2';
      const expected = '1. 2. 3';
      expect(removeRedundantString(input)).toBe(expected);
    });

    it('should handle email strings without adding extra spaces', () => {
      const input = 'john.doe@example.com';
      const expected = 'john.doe@example.com';
      expect(removeRedundantString(input)).toBe(expected);
    });

    it('should handle custom separator', () => {
      const input = 'apple-orange-apple-banana-orange';
      const expected = 'apple. orange. banana';
      expect(removeRedundantString(input, '-')).toBe(expected);
    });

    it('should return empty string for empty input', () => {
      expect(removeRedundantString('')).toBe('');
    });

    it('should handle single word input', () => {
      expect(removeRedundantString('apple')).toBe('apple');
    });
  });

  describe('formatDecimal', () => {
    it('should convert a valid decimal string to a number', () => {
      expect(formatDecimal('123.45')).toBe(123.45);
    });

    it('should convert an integer string to a number', () => {
      expect(formatDecimal('100')).toBe(100);
    });

    it('should return NaN for non-numeric strings', () => {
      expect(formatDecimal('abc')).toBeNaN();
    });

    it('should return 0 for "0"', () => {
      expect(formatDecimal('0')).toBe(0);
    });
  });

  describe('getCurrentLanguage', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should return "en" if language is set to en', async () => {
      sessionStorage.setItem('rsdk_locale', 'en_GB');
      expect(getCurrentLanguage()).toBe('en');
    });

    it('should return "cy" if language is set to cy', async () => {
      sessionStorage.setItem('rsdk_locale', 'cy_GB');
      expect(getCurrentLanguage()).toBe('cy');
    });
  });
});

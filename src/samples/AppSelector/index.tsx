import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import Registration from '../Registration/index';
// import CookiePage from '../Registration/cookiePage/index';
// import Accessibility from '../Registration/AccessibilityPage';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import ProtectedRoute from '../../components/HOC/ProtectedRoute';
import AppWrapper from '../../components/AppComponents/AppWrapper';
import StartPage from '../Registration/StartPage';
import Accessibility from '../Registration/AccessibilityPage';
import CookiePage from '../Registration/cookiePage';
import GOVUKHeader from '../../components/AppComponents/GOVUKHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import LogoutConfirmationPage from '../../components/AppComponents/LogoutConfirmationPage';

const AppSelector = () => {
  const [i18nloaded, seti18nloaded] = useState(false);

  useEffect(() => {
    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
        backend: {
          loadPath: `assets/i18n/{{lng}}.json`
        },
        fallbackLng: 'en',
        debug: false,
        returnNull: false,
        react: {
          useSuspense: false
        }
      })
      .finally(() => {
        seti18nloaded(true);
        setPageTitle();
      });
  }, []);

  return !i18nloaded ? null : (
    <Routes>
      {/* Redirect root URL to /start */}
      <Route path='/' element={<Navigate to='/registration' replace />} />

      {/* Start screen - requires no authentication
      <Route
        path='/start'
        element={
          <>
            <GOVUKHeader isFullWidth={false} />
            <div className='govuk-width-container'>
              <MainWrapper>
                <StartPage />
              </MainWrapper>
            </div>
            <AppFooter />
          </>
        }
      /> */}

      {/* Registration flow - protected - requires Government Gateway authentication */}
      <Route path='/registration' element={<ProtectedRoute component={Registration} journeyName='registration' />} />

      <Route
        path='/cookies'
        element={
          <AppWrapper>
            <CookiePage />
          </AppWrapper>
        }
      />
      <Route
        path='/accessibility'
        element={
          <AppWrapper>
            <Accessibility />
          </AppWrapper>
        }
      />
      <Route
        path='/registration-loggedout'
        element={
          <AppWrapper>
            <LogoutConfirmationPage baseurl='registration' />
          </AppWrapper>
        }
      />
    </Routes>
  );
};

export default AppSelector;

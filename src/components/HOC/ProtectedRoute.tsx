import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getSdkConfig, loginIfNecessary, sdkIsLoggedIn, sdkSetAuthHeader } from '@pega/auth/lib/sdk-auth-manager';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onRedirectDone = () => {
    navigate(location.pathname, { replace: true });
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'HICBC', mainRedirect: true });
  };

  if (!sdkIsLoggedIn()) {
    getSdkConfig().then(sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;
      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
        const now = new Date();
        const expTime = new Date(now.getTime() + 5 * 60 * 1000);
        let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex, '');
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      // Login if needed, without doing an initial main window redirect
      loginIfNecessary({ appName: 'HICBC', mainRedirect: true, redirectDoneCB: onRedirectDone });
    });
  }
  return <Component {...rest} journeyName={rest.journeyName} />;
};

export default ProtectedRoute;

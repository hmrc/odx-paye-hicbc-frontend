import React, { ReactElement } from 'react';
import ShutterServicePage from './index';

interface ShutterServiceProps {
  isShuttered: boolean;
  children: ReactElement;
}

function ShutterServicePageWrapper({ isShuttered, children }: ShutterServiceProps) {
  return isShuttered ? (
    <div className='govuk-width-container'>
      <ShutterServicePage />
    </div>
  ) : (
    children
  );
}

export default ShutterServicePageWrapper;

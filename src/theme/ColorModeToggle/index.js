import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode} from '@docusaurus/theme-common';

// Keep Docusaurus in charge of persistence and the pre-hydration theme.
export default function ColorModeToggle({className, buttonClassName, onChange}) {
  const isBrowser = useIsBrowser();
  const {colorMode} = useColorMode();
  const dark = colorMode === 'dark';
  return (
    <div className={className}>
      <button
        className={clsx('hw-color-mode', buttonClassName)}
        type="button"
        role="switch"
        aria-checked={dark}
        disabled={!isBrowser}
        onClick={() => onChange(dark ? 'light' : 'dark')}>
        <span className="hw-color-mode__track" aria-hidden="true" />
        Dark mode
      </button>
    </div>
  );
}

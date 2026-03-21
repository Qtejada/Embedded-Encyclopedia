import React from 'react';

/**
 * InteractiveBlock — A clean wrapper for interactive simulations and calculators.
 * 
 * Usage in MDX:
 *   import InteractiveBlock from '@site/src/components/InteractiveBlock';
 *   
 *   <InteractiveBlock title="MOSFET Region Explorer">
 *     <MosfetCalc />
 *   </InteractiveBlock>
 * 
 * Props:
 *   - title (string): Label shown in the header bar
 *   - children: The interactive component(s) to render inside
 */
export default function InteractiveBlock({ title, children }) {
  return (
    <div className="interactive-block">
      {title && (
        <div className="interactive-block__header">
          {title}
        </div>
      )}
      <div className="interactive-block__body">
        {children}
      </div>
    </div>
  );
}

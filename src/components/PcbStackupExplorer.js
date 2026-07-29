import React, {useMemo, useState} from 'react';

const STACKUPS = [
  {
    id: 'four-layer',
    name: '4 layers',
    summary: 'Two outer signal layers with two inner planes.',
    defaultSignalLayer: 1,
    layers: [
      {
        number: 1,
        kind: 'signal',
        name: 'Top signal',
        role: 'Components and critical routing',
        referenceLayer: 2,
      },
      {
        number: 2,
        kind: 'ground',
        name: 'Ground plane',
        role: 'Primary return reference',
      },
      {
        number: 3,
        kind: 'power',
        name: 'Power plane',
        role: 'Power distribution and L4 reference',
      },
      {
        number: 4,
        kind: 'signal',
        name: 'Bottom signal',
        role: 'General routing',
        referenceLayer: 3,
      },
    ],
  },
  {
    id: 'six-layer',
    name: '6 layers',
    summary: 'Three signal layers with a ground plane near each outer layer.',
    defaultSignalLayer: 3,
    layers: [
      {
        number: 1,
        kind: 'signal',
        name: 'Top signal',
        role: 'Components and critical routing',
        referenceLayer: 2,
      },
      {
        number: 2,
        kind: 'ground',
        name: 'Ground plane',
        role: 'Primary L1 and L3 reference',
      },
      {
        number: 3,
        kind: 'signal',
        name: 'Inner signal',
        role: 'High-speed or dense routing',
        referenceLayer: 2,
      },
      {
        number: 4,
        kind: 'power',
        name: 'Power plane',
        role: 'Power distribution',
      },
      {
        number: 5,
        kind: 'ground',
        name: 'Ground plane',
        role: 'Primary L6 reference',
      },
      {
        number: 6,
        kind: 'signal',
        name: 'Bottom signal',
        role: 'General routing',
        referenceLayer: 5,
      },
    ],
  },
  {
    id: 'ten-layer',
    name: '10 layers',
    summary: 'Four signal layers plus two optional mixed-routing layers.',
    defaultSignalLayer: 3,
    layers: [
      {
        number: 1,
        kind: 'signal',
        name: 'Top signal',
        role: 'Components and critical routing',
        referenceLayer: 2,
      },
      {
        number: 2,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L1 and L3 return reference',
      },
      {
        number: 3,
        kind: 'signal',
        name: 'Inner signal',
        role: 'High-speed buses',
        referenceLayer: 2,
      },
      {
        number: 4,
        kind: 'power',
        name: 'Power plane',
        role: 'Upper-side power distribution',
      },
      {
        number: 5,
        kind: 'mixed',
        name: 'Power or mixed routing',
        role: 'Power distribution or approved signal routing',
        referenceLayer: 4,
      },
      {
        number: 6,
        kind: 'mixed',
        name: 'Power or mixed routing',
        role: 'Power distribution or approved signal routing',
        referenceLayer: 7,
      },
      {
        number: 7,
        kind: 'power',
        name: 'Power plane',
        role: 'Lower-side power distribution',
      },
      {
        number: 8,
        kind: 'signal',
        name: 'Inner signal',
        role: 'High-speed buses',
        referenceLayer: 9,
      },
      {
        number: 9,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L8 and L10 return reference',
      },
      {
        number: 10,
        kind: 'signal',
        name: 'Bottom signal',
        role: 'General routing',
        referenceLayer: 9,
      },
    ],
  },
  {
    id: 'twelve-layer',
    name: '12 layers',
    summary: 'Four signal layers plus two optional mixed-routing layers.',
    defaultSignalLayer: 3,
    layers: [
      {
        number: 1,
        kind: 'signal',
        name: 'Top signal',
        role: 'Components and critical routing',
        referenceLayer: 2,
      },
      {
        number: 2,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L1 and L3 return reference',
      },
      {
        number: 3,
        kind: 'signal',
        name: 'Inner signal',
        role: 'High-speed buses',
        referenceLayers: [2, 4],
      },
      {
        number: 4,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L3 return reference with L2',
      },
      {
        number: 5,
        kind: 'power',
        name: 'Power plane',
        role: 'Upper-side power distribution',
      },
      {
        number: 6,
        kind: 'mixed',
        name: 'Power or mixed routing',
        role: 'Power distribution or approved signal routing',
        referenceLayer: 5,
      },
      {
        number: 7,
        kind: 'mixed',
        name: 'Power or mixed routing',
        role: 'Power distribution or approved signal routing',
        referenceLayer: 8,
      },
      {
        number: 8,
        kind: 'power',
        name: 'Power plane',
        role: 'Lower-side power distribution',
      },
      {
        number: 9,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L10 return reference',
      },
      {
        number: 10,
        kind: 'signal',
        name: 'Inner signal',
        role: 'High-speed buses',
        referenceLayers: [9, 11],
      },
      {
        number: 11,
        kind: 'ground',
        name: 'Ground plane',
        role: 'L10 and L12 return reference',
      },
      {
        number: 12,
        kind: 'signal',
        name: 'Bottom signal',
        role: 'General routing',
        referenceLayer: 11,
      },
    ],
  },
];

const kindStyles = {
  signal: {
    label: 'Signal',
    accent: 'var(--ifm-color-primary)',
  },
  ground: {
    label: 'Ground',
    accent: 'var(--hw-accent-teal)',
  },
  power: {
    label: 'Power',
    accent: 'var(--hw-accent-blue)',
  },
  mixed: {
    label: 'Power / mixed',
    accent: 'var(--hw-accent-purple)',
  },
};

const presetButtonStyle = {
  minHeight: '4.2rem',
  padding: '0.7rem 0.8rem',
  border: '1px solid var(--hw-border)',
  borderRadius: '8px',
  background: 'var(--hw-surface-1)',
  color: 'var(--hw-text-primary)',
  cursor: 'pointer',
  font: 'inherit',
  textAlign: 'left',
};

const layerBaseStyle = {
  display: 'grid',
  gridTemplateColumns: '2.5rem minmax(0, 1fr)',
  gap: '0.65rem',
  alignItems: 'center',
  width: '100%',
  minHeight: '2.65rem',
  padding: '0.45rem 0.65rem',
  border: '1px solid var(--hw-border)',
  borderLeftWidth: '5px',
  borderRadius: '6px',
  background: 'var(--hw-surface-1)',
  color: 'var(--hw-text-primary)',
  font: 'inherit',
  textAlign: 'left',
};

function LayerContent({layer}) {
  const type = kindStyles[layer.kind];

  return (
    <>
      <strong
        style={{
          color: type.accent,
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: '0.85rem',
        }}
      >
        L{layer.number}
      </strong>
      <span style={{minWidth: 0}}>
        <strong style={{display: 'block', fontSize: '0.88rem'}}>
          {layer.name}
          <span
            style={{
              marginLeft: '0.45rem',
              color: type.accent,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {type.label}
          </span>
        </strong>
        <span
          style={{
            display: 'block',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.8rem',
            lineHeight: 1.35,
          }}
        >
          {layer.role}
        </span>
      </span>
    </>
  );
}

function StackupLayer({
  layer,
  isSelected,
  isReference,
  onSelect,
}) {
  const type = kindStyles[layer.kind];
  const layerStyle = {
    ...layerBaseStyle,
    borderColor: isSelected
      ? 'var(--ifm-color-primary)'
      : isReference
        ? type.accent
        : 'var(--hw-border)',
    borderLeftColor: type.accent,
    boxShadow: isSelected
      ? 'inset 0 0 0 1px var(--ifm-color-primary)'
      : isReference
        ? `inset 0 0 0 1px ${type.accent}`
        : 'none',
    background: isSelected
      ? 'var(--hw-surface-3)'
      : isReference
        ? 'var(--hw-surface-2)'
        : 'var(--hw-surface-1)',
  };

  if (layer.kind === 'signal' || layer.kind === 'mixed') {
    return (
      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={`Select layer ${layer.number}, ${layer.name}, for signal routing: ${layer.role}`}
        onClick={() => onSelect(layer.number)}
        style={{...layerStyle, cursor: 'pointer'}}
      >
        <LayerContent layer={layer} />
      </button>
    );
  }

  return (
    <div
      aria-label={`Layer ${layer.number}, ${layer.name}: ${layer.role}${
        isReference ? '. Designated reference plane for the selected routing layer.' : ''
      }`}
      style={layerStyle}
    >
      <LayerContent layer={layer} />
    </div>
  );
}

export default function PcbStackupExplorer() {
  const [selectedStackupId, setSelectedStackupId] = useState(STACKUPS[0].id);
  const [selectedSignalLayer, setSelectedSignalLayer] = useState(
    STACKUPS[0].defaultSignalLayer,
  );

  const selectedStackup = useMemo(
    () =>
      STACKUPS.find((stackup) => stackup.id === selectedStackupId) ??
      STACKUPS[0],
    [selectedStackupId],
  );

  const signalLayer =
    selectedStackup.layers.find(
      (layer) => layer.number === selectedSignalLayer,
    ) ??
    selectedStackup.layers.find(
      (layer) => layer.kind === 'signal' || layer.kind === 'mixed',
    );

  const referenceLayerNumbers =
    signalLayer.referenceLayers ?? [signalLayer.referenceLayer];
  const referenceLayers = selectedStackup.layers.filter((layer) =>
    referenceLayerNumbers.includes(layer.number),
  );

  const selectStackup = (stackup) => {
    setSelectedStackupId(stackup.id);
    setSelectedSignalLayer(stackup.defaultSignalLayer);
  };

  const separations = referenceLayers.map((layer) =>
    Math.abs(signalLayer.number - layer.number),
  );

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        PCB stackup explorer
      </div>
      <div className="interactive-block__body">
        <p style={{marginTop: 0}}>
          Select an example stackup. Then select a signal-routing layer to
          highlight its designated reference plane. If you select a mixed
          layer, the explorer models that layer as signal routing.
        </p>

        <div
          role="group"
          aria-label="Example PCB stackups"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 125px), 1fr))',
            gap: '0.65rem',
            marginBottom: '1.4rem',
          }}
        >
          {STACKUPS.map((stackup) => {
            const isSelected = stackup.id === selectedStackup.id;

            return (
              <button
                key={stackup.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectStackup(stackup)}
                style={{
                  ...presetButtonStyle,
                  borderColor: isSelected
                    ? 'var(--ifm-color-primary)'
                    : 'var(--hw-border)',
                  boxShadow: isSelected
                    ? 'inset 0 0 0 1px var(--ifm-color-primary)'
                    : 'none',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    color: isSelected
                      ? 'var(--ifm-color-primary)'
                      : 'var(--hw-text-primary)',
                  }}
                >
                  {stackup.name}
                </strong>
                <span
                  style={{
                    display: 'block',
                    marginTop: '0.25rem',
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.8rem',
                    lineHeight: 1.35,
                  }}
                >
                  {stackup.summary}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
            gap: '1rem',
            alignItems: 'start',
          }}
        >
          <figure
            style={{
              margin: 0,
              padding: '1rem',
              border: '1px solid var(--hw-border)',
              borderRadius: '10px',
              background: 'var(--hw-surface-2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              <strong style={{color: 'var(--hw-text-primary)'}}>
                Board cross-section
              </strong>
              <span>Top to bottom</span>
            </div>

            <ol
              aria-label={`${selectedStackup.name} conceptual layer order`}
              style={{listStyle: 'none', margin: 0, padding: 0}}
            >
              {selectedStackup.layers.map((layer, index) => (
                <li key={layer.number} style={{margin: 0}}>
                  <StackupLayer
                    layer={layer}
                    isSelected={layer.number === signalLayer.number}
                    isReference={referenceLayerNumbers.includes(layer.number)}
                    onSelect={setSelectedSignalLayer}
                  />
                  {index < selectedStackup.layers.length - 1 && (
                    <div
                      aria-hidden="true"
                      style={{
                        height: '6px',
                        margin: '0 0.6rem',
                        borderLeft: '1px solid var(--hw-border)',
                        borderRight: '1px solid var(--hw-border)',
                        background:
                          'repeating-linear-gradient(135deg, var(--hw-surface-1) 0 4px, var(--hw-surface-2) 4px 8px)',
                      }}
                    />
                  )}
                </li>
              ))}
            </ol>

            <figcaption
              style={{
                marginTop: '0.75rem',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.8rem',
                lineHeight: 1.45,
              }}
            >
              Copper and dielectric thicknesses are not drawn to scale.
            </figcaption>
          </figure>

          <div className="tech-panel">
            <span className="panel-header">Selected return reference</span>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{marginTop: 0}}
            >
              <strong style={{color: 'var(--ifm-color-primary)'}}>
                L{signalLayer.number} — {signalLayer.name}
              </strong>
              <br />
              <strong>
                {referenceLayers.length === 1
                  ? 'Designated plane:'
                  : 'Designated planes:'}
              </strong>{' '}
              {referenceLayers
                .map((layer) => `L${layer.number} — ${layer.name}`)
                .join(' and ')}
            </p>
            <p>
              {referenceLayers.length > 1
                ? 'This example identifies the two adjacent ground planes. The dielectric geometry determines how the return field divides between them.'
                : separations[0] === 1
                  ? 'The example places the designated reference on the adjacent copper layer.'
                  : `The example places the designated reference ${separations[0]} copper layers away.`}
            </p>
            <p style={{marginBottom: 0}}>
              A continuous reference plane gives high-frequency return
              current a nearby path. When a trace changes layers or reference
              planes, review the return path and add suitable stitching or
              decoupling where the design requires it.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.55rem 1rem',
            marginTop: '1rem',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.8rem',
          }}
          aria-label="Layer color key"
        >
          {Object.entries(kindStyles).map(([kind, type]) => (
            <span
              key={kind}
              style={{display: 'inline-flex', alignItems: 'center', gap: '0.35rem'}}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '0.75rem',
                  height: '0.3rem',
                  borderRadius: '999px',
                  background: type.accent,
                }}
              />
              {type.label}
            </span>
          ))}
        </div>

        <p
          style={{
            margin: '1rem 0 0',
            paddingTop: '1rem',
            borderTop: '1px solid var(--hw-border)',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.82rem',
            lineHeight: 1.55,
          }}
        >
          These examples are conceptual starting points. The PCB fabricator
          controls the available dielectric and copper materials, process
          limits, and manufacturing tolerances. Work with the fabricator to
          define the dielectric thicknesses, copper weights, and finished
          board thickness. Use the fabricator-approved stackup for controlled
          impedance calculations and field-solver results.
        </p>
      </div>
    </div>
  );
}

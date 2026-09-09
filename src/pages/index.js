import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const SECTIONS = [
  {
    id: 'foundations',
    number: '00',
    title: 'Foundations',
    description: 'Core EE principles: Ohm\'s law, Kirchhoff, impedance, precision design methodology.',
    topics: ['Fundamentals', 'Precision Design'],
    path: '/docs/Foundations',
  },
  {
    id: 'discrete',
    number: '01',
    title: 'Discrete Components',
    description: 'Passives, magnetics, and semiconductors: resistors through IGBTs with interactive calculators.',
    topics: ['Resistors', 'Capacitors', 'Inductors', 'Diodes', 'BJTs', 'MOSFETs', 'IGBTs'],
    path: '/docs/Discrete-Components/Passives/Resistors',
  },
  {
    id: 'power',
    number: '02',
    title: 'Power',
    description: 'Entry protection, measurement, power control, and voltage regulation topologies.',
    topics: ['Fuses', 'TVS', 'Current Sense', 'Buck', 'Boost', 'LDOs', 'Gate Drivers'],
    path: '/docs/Power/Entry Protection/fuses',
  },
  {
    id: 'signal',
    number: '03',
    title: 'Signal Modulation',
    description: 'Amplifiers, data converters, filters, and timing from op-amps to PLLs.',
    topics: ['Op-Amps', 'Diff Amps', 'ADCs', 'DACs', 'Active Filters', 'Crystal Oscillators'],
    path: '/docs/Signal-Modulation/Amplifiers/op-amps',
  },
  {
    id: 'digital',
    number: '04',
    title: 'Digital Interfaces',
    description: 'Serial buses, memory types, protocol bridges, and level shifting.',
    topics: ['UART', 'SPI', 'I²C', 'USB', 'Ethernet', 'EEPROM', 'Flash'],
    path: '/docs/Digital-Interfaces/DigitalGeneral',
  },
  {
    id: 'pcb',
    number: '05',
    title: 'PCB Layout',
    description: 'Return paths, trace impedance, high-speed design, and layout best practices.',
    topics: ['Overview', 'Return Paths', 'Trace Impedance', 'High Speed'],
    path: '/docs/PCB-Layout/Overview',
  },
];

function SectionCard({ section }) {
  return (
    <Link to={section.path} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <span className={styles.cardNumber}>
            {section.number}
          </span>
        </div>
        <h3 className={styles.cardTitle}>{section.title}</h3>
        <p className={styles.cardDesc}>{section.description}</p>
        <div className={styles.cardTopics}>
          {section.topics.slice(0, 5).map((topic, i) => (
            <span key={i} className={styles.topicChip}>{topic}</span>
          ))}
          {section.topics.length > 5 && (
            <span className={styles.topicMore}>+{section.topics.length - 5}</span>
          )}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.topicCount}>{section.topics.length} topics</span>
          <span className={styles.cardArrow}>→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="Home"
      description="Interactive Electrical Engineering reference from passives to PCB layout"
    >
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Personal EE Reference</div>
          <h1 className={styles.heroTitle}>
            Hardware{' '}
            <span className={styles.heroAccent}>Encyclopedia</span>
          </h1>
          <div className={styles.heroCTA}>
            <Link to="/docs/Foundations" className={styles.btnPrimary}>
              Start Reading
            </Link>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sections</h2>
        </div>
        <div className={styles.grid}>
          {SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </main>
    </Layout>
  );
}

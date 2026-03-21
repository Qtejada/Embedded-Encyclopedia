import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const SECTIONS = [
  {
    id: 'foundations',
    number: '00',
    title: 'Foundations',
    description: 'Core EE principles — Ohm\'s law, Kirchhoff, impedance, precision design methodology.',
    topics: ['Fundamentals', 'Precision Design'],
    color: '#d4a017',
    path: '/docs/Foundations',
    icon: '⚡',
  },
  {
    id: 'discrete',
    number: '01',
    title: 'Discrete Components',
    description: 'Passives, magnetics, and semiconductors — resistors through IGBTs with interactive calculators.',
    topics: ['Resistors', 'Capacitors', 'Inductors', 'Diodes', 'BJTs', 'MOSFETs', 'IGBTs'],
    color: '#f59e0b',
    path: '/docs/Discrete-Components/Passives/Resistors',
    icon: '🔧',
  },
  {
    id: 'power',
    number: '02',
    title: 'Power',
    description: 'Entry protection, measurement, power control, and voltage regulation topologies.',
    topics: ['Fuses', 'TVS', 'Current Sense', 'Buck', 'Boost', 'LDOs', 'Gate Drivers'],
    color: '#ef4444',
    path: '/docs/Power/Entry Protection/fuses',
    icon: '🔋',
  },
  {
    id: 'signal',
    number: '03',
    title: 'Signal Modulation',
    description: 'Amplifiers, data converters, filters, and timing — from op-amps to PLLs.',
    topics: ['Op-Amps', 'Diff Amps', 'ADCs', 'DACs', 'Active Filters', 'Crystal Oscillators'],
    color: '#a855f7',
    path: '/docs/Signal-Modulation/Amplifiers/op-amps',
    icon: '📡',
  },
  {
    id: 'digital',
    number: '04',
    title: 'Digital Interfaces',
    description: 'Serial buses, memory types, protocol bridges, and level shifting.',
    topics: ['UART', 'SPI', 'I²C', 'USB', 'Ethernet', 'EEPROM', 'Flash'],
    color: '#3b82f6',
    path: '/docs/Digital-Interfaces/DigitalGeneral',
    icon: '💾',
  },
  {
    id: 'pcb',
    number: '05',
    title: 'PCB Layout',
    description: 'Return paths, trace impedance, high-speed design, and layout best practices.',
    topics: ['Overview', 'Return Paths', 'Trace Impedance', 'High Speed'],
    color: '#14b8a6',
    path: '/docs/PCB-Layout/Overview',
    icon: '🖥️',
  },
];

function SectionCard({ section }) {
  return (
    <Link to={section.path} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <span className={styles.cardNumber} style={{ color: section.color }}>
            {section.number}
          </span>
          <span className={styles.cardIcon}>{section.icon}</span>
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
      <div className={styles.cardGlow} style={{ background: section.color }} />
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="Home"
      description="Interactive Electrical Engineering reference — from passives to PCB layout"
    >
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Personal EE Reference</div>
          <h1 className={styles.heroTitle}>
            Hardware<br />
            <span className={styles.heroAccent}>Encyclopedia</span>
          </h1>
          <p className={styles.heroSub}>
            A living notebook of electrical engineering fundamentals —
            interactive simulations, design notes, and practical reference
            from discrete components through PCB layout.
          </p>
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
          <p className={styles.sectionSub}>
            Organized from fundamentals → components → subsystems → physical layout
          </p>
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

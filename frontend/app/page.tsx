'use client';

import dynamic from "next/dynamic";
import styles from './App.module.css';

const PlotDisplay = dynamic(() => import("../components/PlotDisplay"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Create New Visualization</h1>
        <p>Upload your CSV file and interactively visualize your data.</p>
      </header>
      <PlotDisplay />
    </div>
  );
}

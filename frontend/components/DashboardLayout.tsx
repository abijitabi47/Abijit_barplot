import React, { ReactNode } from "react";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2>📊 DataViz Tool</h2>
        <nav>
          <ul>
            <li>New Visualization</li>
            <li>History</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

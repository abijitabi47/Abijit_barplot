import React, { useRef } from "react";
import Papa from "papaparse";
import styles from "./FileUpload.module.css";

const FileUpload = ({ setData, setHeaders }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
      },
    });
  };

  return (
    <div className={styles.uploadSection}>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
      <label className={styles.uploadButton} onClick={() => fileInputRef.current.click()}>
        📤 Upload CSV File
      </label>
    </div>
  );
};

export default FileUpload;

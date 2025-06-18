"use client";

import React, { useState, useRef } from "react";
import Plot from "react-plotly.js";
import styles from "./PlotDisplay.module.css";

const PlotDisplay = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [x, setX] = useState("");
  const [y, setY] = useState([]);
  const [yColors, setYColors] = useState({});
  const [title, setTitle] = useState("New Visualization");
  const [xLabel, setXLabel] = useState("");
  const [yLabel, setYLabel] = useState("");
  const [format, setFormat] = useState("png");
  const [dpi, setDpi] = useState(300);
  const [plotGenerated, setPlotGenerated] = useState(false);
  const [plotType, setPlotType] = useState("bar");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const plotRef = useRef(null);

  const extractColumn = (key) => data.map((row) => Number(row[key]));

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/upload/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("📦 FastAPI returned:", result); // <-- ADD THIS

    if (!result.columns || !result.preview) {
      throw new Error("Missing expected fields in response.");
    }

    setHeaders(result.columns);
    setData(result.preview);
    setX(result.columns[0]);
    setY([result.columns[1]]);
    setXLabel(result.columns[0]);
    setYLabel(result.columns[1]);
    setYColors({ [result.columns[1]]: "#1e88e5" });
    setPlotGenerated(false);
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed: " + error.message);
  } finally {
    setIsUploading(false);
  }
};



  const downloadPlot = () => {
    if (!plotRef.current) return;
    window.Plotly.toImage(plotRef.current, {
      format,
      height: 500,
      width: 900,
    }).then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `plot.${format}`;
      a.click();
    }).catch((error) => {
      console.error("Export failed:", error);
      alert("Plot is not ready yet. Please try again in a moment.");
    });
  };

  return (
    <section className={styles.visualizer}>
      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "4px" }}>Upload Dataset</h2>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
          Select a CSV file to visualize your data
        </p>
        <label htmlFor="csv-file" style={{ fontSize: "14px", fontWeight: "500" }}>CSV File</label>
        <input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isUploading}
          ref={fileInputRef}
          className={styles.uploadInput}
        />

        {isUploading && (
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Uploading and parsing CSV...
          </p>
        )}
        {data.length > 0 && (
          <p style={{ fontSize: "14px", color: "#059669" }}>
            ✓ Loaded {data.length} rows with columns: {headers.join(", ")}
          </p>
        )}
      </div>

      {data.length > 0 && (
        <>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label>X Axis</label>
              <select value={x} onChange={(e) => { setX(e.target.value); setXLabel(e.target.value); }}>
                {headers.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label>Y Axis Components</label>
              <div className={styles.yListHorizontal}>
                {headers.map((header) => (
                  <div key={header} className={styles.yItemHorizontal}>
                    <span className={styles.yLabel}>{header}</span>
                    <input
                      type="checkbox"
                      className={styles.toggle}
                      checked={y.includes(header)}
                      onChange={() => {
                        const updated = y.includes(header)
                          ? y.filter((h) => h !== header)
                          : [...y, header];
                        setY(updated);
                        if (!yColors[header]) {
                          setYColors({ ...yColors, [header]: "#1e88e5" });
                        }
                        setYLabel(updated.join(", "));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className={styles.controlGroup}>
              <label>X Label</label>
              <input type="text" value={xLabel} onChange={(e) => setXLabel(e.target.value)} />
            </div>

            <div className={styles.controlGroup}>
              <label>Y Label</label>
              <input type="text" value={yLabel} onChange={(e) => setYLabel(e.target.value)} />
            </div>

            {y.map((yKey) => (
              <div className={styles.controlGroup} key={`color-${yKey}`}>
                <label>Color for {yKey}</label>
                <input
                  type="color"
                  value={yColors[yKey]}
                  onChange={(e) => setYColors({ ...yColors, [yKey]: e.target.value })}
                />
              </div>
            ))}

            <div className={styles.controlGroup}>
              <label>Export</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label>DPI</label>
              <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))}>
                <option value={300}>300</option>
                <option value={400}>400</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>

          <button className={styles.generateButton} onClick={() => setPlotGenerated(true)}>
            Generate Plot
          </button>

          {plotGenerated && (
            <>
              <div className={styles.plotWrapper}>
                <Plot
                  ref={plotRef}
                  divId="customPlot"
                  data={y.map((yKey) => ({
                    x: extractColumn(x),
                    y: extractColumn(yKey),
                    type: plotType,
                    mode: plotType === "scatter" ? "markers" : undefined,
                    marker: { color: yColors[yKey] },
                    name: yKey,
                  }))}
                  layout={{
                    title: {
                      text: title,
                      font: { size: 22, family: "Inter, sans-serif", weight: "600" },
                      x: 0.02,
                    },
                    xaxis: { title: { text: xLabel }, gridcolor: "#eee" },
                    yaxis: { title: { text: yLabel }, gridcolor: "#eee" },
                    margin: { t: 60, l: 60, r: 20, b: 60 },
                    paper_bgcolor: "#fff",
                    plot_bgcolor: "#f7f9fc",
                    font: { color: "#2c3e50" },
                    hovermode: "closest",
                  }}
                  useResizeHandler
                  style={{ width: "100%", height: "100%" }}
                  config={{ responsive: true }}
                />
              </div>

              <button className={styles.exportButton} onClick={downloadPlot}>
                📥 Export as {format.toUpperCase()}
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default PlotDisplay;

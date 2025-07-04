"use client";

import React, { useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";
import styles from "./PlotDisplay.module.css";

const PlotDisplay = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [x, setX] = useState([]);
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
  const [mode, setMode] = useState("interactive");
  const [matplotlibImage, setMatplotlibImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const plotRef = useRef(null);

  const extractColumn = (key) => data.map((row) => Number(row[key]));

const generateBackendPlot = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("x_columns", JSON.stringify(x));
    formData.append("y_columns", JSON.stringify(y));
    formData.append("y_colors", JSON.stringify(yColors));
    formData.append("title", title);
    formData.append("x_label", xLabel);
    formData.append("y_label", yLabel);
    formData.append("format", format); // png/jpeg/svg/etc
    formData.append("dpi", dpi);       // 300/400/500

    const response = await fetch("http://localhost:8000/matplotlib-plot/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Backend error:", errText);
      throw new Error("Backend failed to return image");
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    setMatplotlibImage(imageUrl);
  } catch (err) {
    console.error("Matplotlib error:", err);
    alert("Failed to render backend chart");
  }
};


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!result.columns || !result.preview) {
        throw new Error("Missing expected fields in response.");
      }

      setHeaders(result.columns);
      setData(result.preview);
      setX([result.columns[0]]);
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
  const plotDiv = plotRef.current?.el;

  if (!plotDiv) {
    alert("Plot is not ready yet. Please try again in a moment.");
    return;
  }

  Plotly.redraw(plotDiv).then(() => {
    return Plotly.toImage(plotDiv, {
      format,
      height: 500,
      width: 900,
    });
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


  useEffect(() => {
    if (!uploadedFile) return;

    const fetchImage = async () => {
      try {
        if (mode === "backend" && plotGenerated) {
          await generateBackendPlot(uploadedFile);
        }
      } catch (err) {
        console.error("Error in fetchImage:", err);
      }
    };

    fetchImage();
  }, [mode, plotGenerated, uploadedFile]);

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
        {data.length > 0 && mode === "interactive" && (
          <p style={{ fontSize: "14px", color: "#059669" }}>
            ✓ Loaded {data.length} rows with columns: {headers.join(", ")}
          </p>
        )}
      </div>

      {data.length > 0 && (
        <>
          {(mode === "interactive" || mode === "backend") && (
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <label>X Axis</label>
                <div className={styles.yListHorizontal}>
                  {headers.map((header) => (
                    <div key={header} className={styles.yItemHorizontal}>
                      <span className={styles.yLabel}>{header}</span>
                      <input
                        type="checkbox"
                        className={styles.toggle}
                        checked={x.includes(header)}
                        onChange={() => {
                          const updated = x.includes(header)
                            ? x.filter((h) => h !== header)
                            : [...x, header];
                          setX(updated);
                          setXLabel(updated.join(", "));
                        }}
                      />
                    </div>
                  ))}
                </div>
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

              <div className={styles.controlGroup}><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className={styles.controlGroup}><label>X Label</label><input type="text" value={xLabel} onChange={(e) => setXLabel(e.target.value)} /></div>
              <div className={styles.controlGroup}><label>Y Label</label><input type="text" value={yLabel} onChange={(e) => setYLabel(e.target.value)} /></div>

              {y.map((yKey) => (
                <div className={styles.controlGroup} key={`color-${yKey}`}>
                  <label>Color for {yKey}</label>
                  <input type="color" value={yColors[yKey]} onChange={(e) => setYColors({ ...yColors, [yKey]: e.target.value })} />
                </div>
              ))}

              <div className={styles.controlGroup}><label>Export</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="svg">SVG</option>
                  <option value="webp">WEBP</option>
                </select>
              </div>

              <div className={styles.controlGroup}><label>DPI</label>
                <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))}>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                  <option value={500}>500</option>
                </select>
              </div>
            </div>
          )}

          <button className={styles.generateButton} onClick={() => {
            if (x.length === 0) return alert("Please select at least one X-axis field.");
            setPlotGenerated(true);
            if (mode === "backend" && uploadedFile) {
              generateBackendPlot(uploadedFile);
            }
          }}>
            Generate Plot
          </button>

          <div style={{ margin: "16px 0" }}>
            <label style={{ marginRight: "12px", fontWeight: "600" }}>Mode:</label>
            <button
              onClick={() => {
                setMode("interactive");
                setPlotGenerated(true);
              }}
              style={{
                marginRight: "10px",
                background: mode === "interactive" ? "#1e88e5" : "#e5e7eb",
                color: mode === "interactive" ? "#fff" : "#000",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Interactive Frontend
            </button>

            <button
              onClick={async () => {
                setMode("backend");
                if (uploadedFile) await generateBackendPlot(uploadedFile);
              }}
              style={{
                background: mode === "backend" ? "#1e88e5" : "#e5e7eb",
                color: mode === "backend" ? "#fff" : "#000",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Backend Matplotlib
            </button>
          </div>
        </>
      )}

      {plotGenerated && mode === "interactive" && (
        <>
          <div className={styles.plotWrapper}>
            <Plot
              ref={plotRef}
              divId="customPlot"
              data={y.map((yKey) => ({
                x: x.length === 1
                  ? extractColumn(x[0])
                  : extractColumn(x[0]).map((_, i) =>
                      x.map((key) => data[i][key]).join(" | ")
                    ),
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

      {mode === "backend" && matplotlibImage && (
        <div className={styles.plotWrapper}>
          <img src={matplotlibImage} alt="Matplotlib Plot" style={{ width: "100%", borderRadius: "12px" }} />
          <button
  className={styles.exportButton}
  onClick={() => {
    const a = document.createElement("a");
    a.href = matplotlibImage;
    a.download = `${title || "plot"}.png`;
    a.click();
  }}
>
  📥 Export as PNG
</button>

        </div>
      )}
      
    </section>
  );
};

export default PlotDisplay;

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import matplotlib.pyplot as plt
import io
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    return {
        "columns": list(df.columns),
        "preview": df.head(100).to_dict(orient="records")
    }

@app.post("/matplotlib-plot/")
async def matplotlib_plot(
    file: UploadFile = File(...),
    x_columns: str = Form(...),     # JSON array
    y_columns: str = Form(...),     # JSON array
    y_colors: str = Form(...),      # JSON object: { "Hit1": "#xxxxxx", ... }
    title: str = Form(""),
    x_label: str = Form(""),
    y_label: str = Form(""),
    format: str = Form("png"),      # "png", "jpeg", "svg", etc.
    dpi: int = Form(300)
):
    df = pd.read_csv(file.file)
    x_cols = json.loads(x_columns)
    y_cols = json.loads(y_columns)
    y_colors = json.loads(y_colors)

    fig, ax = plt.subplots(figsize=(10, 6))
    indices = list(range(len(df)))
    width = 0.8 / len(y_cols)

    for i, y in enumerate(y_cols):
        offset = [index + i * width for index in indices]
        ax.bar(offset, df[y], width=width, label=y, color=y_colors.get(y, "#1e88e5"))

    # Combine X
    if len(x_cols) == 1:
        xticks_labels = df[x_cols[0]].astype(str).tolist()
    else:
        xticks_labels = df[x_cols].astype(str).agg(" | ".join, axis=1).tolist()

    tick_interval = max(1, len(indices) // 10)
    xticks_pos = [i + width * (len(y_cols) - 1) / 2 for i in indices][::tick_interval]
    xticks_labels = xticks_labels[::tick_interval]

    ax.set_title(title or "Bar Chart")
    ax.set_xlabel(x_label or ", ".join(x_cols))
    ax.set_ylabel(y_label or ", ".join(y_cols))
    ax.set_xticks(xticks_pos)
    ax.set_xticklabels(xticks_labels, rotation=45)
    ax.legend()
    ax.grid(True, axis='y', linestyle='--', alpha=0.5)

    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format=format, dpi=dpi)
    buf.seek(0)
    return StreamingResponse(buf, media_type=f"image/{format}")

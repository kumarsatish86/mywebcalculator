import { ImageResponse } from "next/og";

export const alt = "mywebcalculator — study, finance & fun calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #f4f6fc 0%, #eef2ff 42%, #e0f2fe 100%)",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6548f5, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            mywebcalculator
          </span>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          Calculators for study, finance & fun
        </div>
        <div style={{ marginTop: 24, fontSize: 26, opacity: 0.62, maxWidth: 820 }}>
          Bright, calm tools — built for mywebcalculator.com
        </div>
      </div>
    ),
    { ...size },
  );
}

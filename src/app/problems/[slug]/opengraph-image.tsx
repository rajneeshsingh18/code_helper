import { ImageResponse } from "next/og";
import { getProblemBySlug } from "@/server/services/problem.service";

export const runtime = "edge";

export const alt = "CodePrep Problem Challenge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const problem = await getProblemBySlug(params.slug);

  if (!problem) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "black",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          Problem Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0A0A0A, #111111)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(to right, #3b82f6, #a855f7)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#3b82f6",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            CodePrep Archive
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: "black",
              color: "white",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {problem.title}
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div
              style={{
                background: problem.difficulty === "Easy" ? "#22c55e" : problem.difficulty === "Medium" ? "#eab308" : "#ef4444",
                padding: "8px 20px",
                borderRadius: "100px",
                color: "black",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {problem.difficulty}
            </div>
            {problem.topics.slice(0, 2).map((t) => (
              <div
                key={t.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "8px 20px",
                  borderRadius: "100px",
                  color: "#94a3b8",
                  fontSize: 24,
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "#3b82f6" }}>&gt;_</span> CodePrep.io
        </div>
      </div>
    ),
    { ...size }
  );
}

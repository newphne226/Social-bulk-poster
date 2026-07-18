"use client";

import * as React from "react";

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1>SocialPilot Extension API</h1>
      <p>Backend running. <a href="/api/health">Health Check</a></p>
      <p>Extension connects to: <code>/api/extension/sync</code></p>
    </div>
  );
}
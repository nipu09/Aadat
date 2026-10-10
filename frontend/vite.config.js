import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    port: 3000, 
  },
  
  // Optional: proxy /api to your backend in dev so you can skip CORS setup
  // server: { proxy: { "/api": "http://localhost:4000" } },
});

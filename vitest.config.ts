// vitest.config.ts

/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // If you're using React

// https://vitest.dev/config/
export default defineConfig({
  // If you are using Vite plugins (like for React), they go here at the top level
  plugins: [react()],

  // All your Vitest-specific options now go inside this 'test' property
  test: {
    // Enable globals like 'describe', 'it', 'expect'
    globals: true,

    // Set the test environment (e.g., 'jsdom' for browser-like testing)
    environment: "jsdom",

    // Point to your setup file to run before each test file
    setupFiles: "./src/tests/setup.ts",

    // Optional: Configure how CSS is handled if you test components
    css: true,
  },
});

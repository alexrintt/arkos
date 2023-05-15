/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        s0: "var(--s0)",
        s1: "var(--s1)",
        s2: "var(--s2)",
        s3: "var(--s3)",
        s4: "var(--s4)",
        t1: "var(--t1)",
        t0: "var(--t0)",
        p1: "var(--p1)",
        p2: "var(--p2)",
        v1: "var(--v1)",
        v2: "var(--v2)",
        v3: "var(--v2)",
        w1: "var(--w1)",
        w2: "var(--w2)",
        w3: "var(--w2)",
        p3: "var(--p3)",
        p4: "var(--p4)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
    },
  },
  plugins: [],
};

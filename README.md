# Parental Legacy & Life Factors Calculator

A React.js single-page application that generates 7 deterministic "life factor" values based on a user's Date of Birth, split between Mother and Father influences, always summing to exactly 100.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Recharts](https://img.shields.io/badge/Recharts-2-green)

---

## Features

### Core
- **DOB Input** — Date picker with validation (no future dates)
- **Auto-Calculation** — Values generated instantly on date selection
- **7 Life Factors** — Genetic Inheritance, Constitutional Vitality, Mental Patterns, Intellectual Capacity, Emotional Foundation, Spiritual Lineage, Soul Connections
- **Results Table** — Mother, Father, and Total per factor with grand totals
- **Dominant Parent Indicator** — Visual display of which parent has higher legacy
- **Charts** — Bar chart, Radar chart, and Donut chart (Recharts)
- **Responsive Design** — Works on desktop, tablet, and mobile

### Bonus Features
- **Dark/Light Mode Toggle** — Theme preference persisted to localStorage
- **Export as CSV** — Download results as a CSV file
- **Export as PDF** — Download a styled PDF report
- **localStorage Persistence** — Last calculation saved and restored on reload

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (functional components + hooks) |
| Build Tool | Vite 8 |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| CSV Export | PapaParse |
| Styling | Vanilla CSS with custom properties |
| State | useState + custom useLocalStorage hook |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Neutrino

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Algorithm Design Decisions

> **Note:** The original specification defines the *direction* of the calculation (odd day = Mother wins, even day = Father wins) and the min/max ranges for each factor, but does not prescribe the exact algorithm for deriving specific decimal values from a DOB. The following approach was chosen to satisfy all mathematical constraints while being deterministic and reproducible.

### 1. Deterministic Seeding
The full DOB string (e.g., `13/7/1995`) is hashed using a DJB2 hash function to produce a 32-bit integer seed. This ensures the **same DOB always produces identical results**.

### 2. Seeded PRNG (Mulberry32)
A Mulberry32 pseudo-random number generator is initialized with the DOB seed. This provides a stream of deterministic pseudo-random values in [0, 1) used for all subsequent calculations.

### 3. Factor Total Generation
For each of the 7 factors, a Total value is generated within its documented `[min, max]` range:

| Factor | Min | Max |
|---|---|---|
| Genetic Inheritance | 9.333 | 10.777 |
| Constitutional Vitality | 8.111 | 9.111 |
| Mental Patterns | 6.111 | 7.111 |
| Intellectual Capacity | 6.333 | 6.999 |
| Emotional Foundation | 7.111 | 7.999 |
| Spiritual Lineage | 5.011 | 6.011 |
| Soul Connections | 5.111 | 6.222 |

### 4. Normalization
The 7 raw totals are proportionally scaled so their sum is exactly 100.000. This is done by dividing each by the raw sum and multiplying by 100.

### 5. Mother/Father Split
Each factor's normalized Total is split into Mother and Father values:
- A seeded "skew" percentage between 51% and 58% is generated per factor
- **Odd birth day** → Mother gets the higher share (51–58%)
- **Even birth day** → Father gets the higher share (51–58%)
- Each row satisfies: `Mother + Father = Total`

### 6. Rounding & Remainder Correction
All values are rounded to 3 decimal places. The last factor receives a remainder correction to ensure the grand total is precisely 100.000, preventing floating-point drift.

---

## Project Structure

```
src/
├── components/
│   ├── Charts.jsx           # Bar, Radar, and Donut charts
│   ├── DateInput.jsx         # Date picker with validation
│   ├── ExportButtons.jsx     # CSV and PDF export
│   ├── ParentIndicator.jsx   # Dominant parent display
│   ├── ResultsTable.jsx      # 7-factor results table
│   └── ThemeToggle.jsx       # Dark/Light mode toggle
├── hooks/
│   └── useLocalStorage.js    # localStorage persistence hook
├── utils/
│   └── calculator.js         # Core calculation engine
├── App.jsx                   # Root component
├── index.css                 # Design system & styles
└── main.jsx                  # Entry point
```

---

## License

MIT

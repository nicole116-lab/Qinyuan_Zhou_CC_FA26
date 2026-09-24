/* ============================================================
   CREATIVE CODING — WORK LIST
   ------------------------------------------------------------
   This is the only file you touch week to week.

   Every entry's "file" points at sketch-runner.html with a
   ?src= query param naming the actual sketch .js file that
   lives right next to it (no per-sketch html needed).

   To add a new week's work:
     1. Save the new sketch as sketchweekN_M.js in this same
        folder (setup()/draw(), same as the existing files).
     2. Add one object below with the right file name.
   That's it — sketch-runner.html and creative-coding.html
   never need to change.
   ============================================================ */
const SITE_DATA = {
  demo: {
    "Week 1": [
      { title: "Sketch", desc: "", file: "sketch-runner.html?src=sketch.js" }
    ],
    "Week 2": [
      { title: "Week 2 — Sketch 1", desc: "", file: "sketch-runner.html?src=sketchweek2_1.js" },
      { title: "Week 2 — Sketch 2", desc: "", file: "sketch-runner.html?src=sketchweek2_2.js" },
      { title: "Week 2 — Sketch 3", desc: "", file: "sketch-runner.html?src=sketchweek2_3.js" },
      { title: "Week 2 — Sketch 4", desc: "", file: "sketch-runner.html?src=sketchweek2_4.js" }
    ],
    "Week 3": [
      { title: "Week 3 — Sketch 1", desc: "", file: "sketch-runner.html?src=sketchweek3_1.js" },
      { title: "Week 3 — Sketch 2", desc: "", file: "sketch-runner.html?src=sketchweek3_2.js" },
      { title: "Week 3 — Sketch 3", desc: "", file: "sketch-runner.html?src=sketchweek3_3.js" },
      { title: "Week 3 — Sketch 4", desc: "", file: "sketch-runner.html?src=sketchweek3_4.js" },
      { title: "Week 3 — Sketch 5", desc: "", file: "sketch-runner.html?src=sketchweek3_5.js" }
    ]
  },
  homework: {
    "Week 3": [
      { title: "Week 3 Homework — 1", desc: "", file: "sketch-runner.html?src=sketchweek3homework_1.js" },
      { title: "Week 3 Homework — 2", desc: "", file: "sketch-runner.html?src=sketchweek3homework_2.js" },
      { title: "Week 3 Homework — 3", desc: "", file: "sketch-runner.html?src=sketchweek3homework_3.js" }
    ]
  }
};

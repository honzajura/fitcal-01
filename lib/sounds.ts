export const chipClickSound = {
  source: { type: "sine" as const, frequency: { start: 320, end: 180 } },
  envelope: { decay: 0.06 },
  gain: 0.25,
};

export const stepperUpSound = {
  source: { type: "sine" as const, frequency: { start: 480, end: 380 } },
  envelope: { decay: 0.035 },
  gain: 0.18,
};

export const stepperDownSound = {
  source: { type: "sine" as const, frequency: { start: 260, end: 190 } },
  envelope: { decay: 0.035 },
  gain: 0.18,
};

export const tabSwitchSound = {
  source: { type: "sine" as const, frequency: { start: 360, end: 240 } },
  envelope: { decay: 0.05 },
  gain: 0.2,
};

export const toggleSound = {
  source: { type: "sine" as const, frequency: { start: 400, end: 300 } },
  envelope: { decay: 0.05 },
  gain: 0.2,
};

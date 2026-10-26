import { sectors } from "@/data/portfolio";

export type FacilityPhase = "corridor" | "approaching" | "room" | "inspecting" | "returning";

// Three connected architectural volumes, in metres. Door openings are cut into each wall.
export const bays = [
  { name: "ARRIVAL HALL", center: 1, length: 34, halfWidth: 4.8, height: 6.4 },
  { name: "PROCESS ATRIUM", center: -27, length: 22, halfWidth: 6, height: 8 },
  { name: "RESEARCH WING", center: -54, length: 32, halfWidth: 5.2, height: 6 },
] as const;

export const doors = sectors.map((sector, index) => {
  const bay = bays[Math.floor(index / 2)];
  const side = index % 2 === 0 ? -1 : 1;
  const z = [-2, -11, -24, -33, -46, -57][index];
  return { ...sector, side, z, x: side * (bay.halfWidth - 0.08), halfWidth: bay.halfWidth, bay: Math.floor(index / 2) };
});

export const pathPoints: [number, number, number][] = [
  [0.5, 2.65, 13], [0.5, 2.65, 8], [-0.5, 2.65, -10],
  [-0.8, 2.85, -22], [0.85, 2.85, -34], [0.5, 2.6, -45], [0, 2.6, -61], [0.5,2.65,-70], [0.5,2.65,-75],
];

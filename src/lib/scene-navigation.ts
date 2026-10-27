export const CORRIDOR_LENGTH = 88;
export type PoseSnapshot = { position: [number, number, number]; quaternion: [number, number, number, number]; progress: number; cycle: number };
export type SceneNavigation = { cursor: number; cycle: number; roomCursor: number; snapshot: PoseSnapshot | null };
export type RoomExperience = "standard" | "project" | "about";
export const fraction = (value: number) => value - Math.floor(value);
export function dampMotion(current: number, target: number, velocity: number, delta: number, maxSpeed = 0.24, smoothTime = 0.28) {
  const omega = 2 / smoothTime, dt = Math.min(delta, 0.1), x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = Math.max(-maxSpeed * smoothTime, Math.min(maxSpeed * smoothTime, current - target));
  const adjusted = current - change, temp = (velocity + omega * change) * dt;
  let next = adjusted + (change + temp) * decay;
  let speed = (velocity - omega * temp) * decay;
  if ((target - current > 0) === (next > target)) { next = target; speed = 0; }
  if (Math.abs(target-next)<0.00001 && Math.abs(speed)<0.0001) { next=target; speed=0; }
  return { value: next, velocity: speed };
}

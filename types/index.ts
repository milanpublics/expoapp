export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO date string, set when task is completed
  priority?: Priority;
}

export type Priority = "low" | "medium" | "high" | "urgent";

export interface CustomTag {
  id: string;
  name: string;
  color: string;
}

/** Soft pastel palette for random tag colors */
export const TAG_COLORS = [
  "#FF6B6B",
  "#FFA06B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B59B6",
  "#E056A0",
  "#00B8A9",
  "#F38181",
  "#AA96DA",
  "#45B7D1",
  "#96CEB4",
  "#E6A817",
  "#DDA0DD",
  "#98D8C8",
];

/** Return white or dark text color for readability on a solid tag background */
export function tagTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1A1A2E" : "#FFFFFF";
}

export const PRIORITY_LEVELS: { key: Priority; color: string }[] = [
  { key: "low", color: "#90A4AE" },
  { key: "medium", color: "#42A5F5" },
  { key: "high", color: "#FFA726" },
  { key: "urgent", color: "#EF5350" },
];

export interface Project {
  id: string;
  title: string;
  description?: string;
  customIconUri?: string; // local image URI or remote URL (banner image)
  priority: Priority;
  dueDate?: string; // ISO date string
  status: "active" | "completed" | "on-hold";
  tasks: Task[];
  tags?: string[]; // CustomTag id array
  createdAt: string;
  completedAt?: string;
}

export interface AppStats {
  completed: number;
  pending: number;
}

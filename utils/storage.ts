import { Project } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleProjects } from "./sampleData";

const PROJECTS_KEY = "@tracker_projects";
const INITIALIZED_KEY = "@tracker_initialized";

export async function getProjects(): Promise<Project[]> {
  try {
    const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
    if (!initialized) {
      await saveProjects(sampleProjects);
      await AsyncStorage.setItem(INITIALIZED_KEY, "true");
      return sampleProjects;
    }
    const json = await AsyncStorage.getItem(PROJECTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading projects:", e);
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Error saving projects:", e);
  }
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function updateProject(updated: Project): Promise<void> {
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    projects[idx] = updated;
    await saveProjects(projects);
  }
}

export async function addProject(project: Project): Promise<void> {
  const projects = await getProjects();
  projects.unshift(project);
  await saveProjects(projects);
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects();
  await saveProjects(projects.filter((p) => p.id !== id));
}

export async function resetData(): Promise<void> {
  await AsyncStorage.removeItem(INITIALIZED_KEY);
  await AsyncStorage.removeItem(PROJECTS_KEY);
}

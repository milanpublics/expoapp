import { Project } from "@/types";

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Redesign the company website with a modern look and feel.",
    priority: "high",
    dueDate: "2026-03-24",
    status: "active",
    createdAt: "2026-01-15",
    tasks: [
      {
        id: "t1",
        title: "Wireframe Homepage",
        description: "",
        completed: true,
      },
      {
        id: "t2",
        title: "Select Color Palette",
        description: "",
        completed: true,
      },
      {
        id: "t3",
        title: "Review Competitors",
        description: "",
        completed: true,
      },
      {
        id: "t4",
        title: "Write Copy for About Page",
        description: "",
        completed: false,
      },
      {
        id: "t5",
        title: "Export Assets",
        description: "Make sure to include SVGs for all icons.",
        completed: false,
      },
      { id: "t6", title: "Final Polish", description: "", completed: false },
      {
        id: "t7",
        title: "Deploy to Production",
        description: "",
        completed: false,
      },
      {
        id: "t8",
        title: "User Acceptance Testing",
        description: "",
        completed: false,
      },
    ],
  },
];

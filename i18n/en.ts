export const en = {
  // Home
  goodMorning: "Good morning",
  goodAfternoon: "Good afternoon",
  goodEvening: "Good evening",
  completed: "Completed",
  pending: "Pending",
  myProjects: "My Projects",
  viewAll: "View all",
  showLess: "Show less",
  newProject: "New Project",
  noProjectsYet: "No projects yet",
  noProjectsHint: "Tap the + button to create your first project",

  // Project Card
  onHold: "On hold",
  completedStatus: "Completed",
  overdue: "Overdue",
  dueToday: "Due today",
  dueTomorrow: "Due tomorrow",
  dueInDays: (days: number) => `Due in ${days} days`,
  tasksLeft: (n: number) => `${n} task${n > 1 ? "s" : ""} left`,
  allTasksDone: "All tasks done",

  // Project Detail
  progress: "PROGRESS",
  addNewTask: "Add a new task",
  markComplete: "Mark Complete",
  deleteProject: "Delete Project",
  deleteConfirm: (name: string) => `Are you sure you want to delete "${name}"?`,
  projectOptions: "Project Options",
  tasks: "Tasks",
  due: "Due",
  loading: "Loading...",
  editProject: "Edit Project",

  // New / Edit Project
  create: "Create",
  projectName: "Project Name",
  enterProjectName: "Enter project name",
  icon: "Icon",
  color: "Color",
  dueDateOptional: "Due Date (optional)",
  dueDatePlaceholder: "YYYY-MM-DD",
  customImage: "Custom Image",
  chooseImage: "Choose Image",
  orEnterUrl: "Or enter image URL",
  imageTooLarge: "Image must be under 2 MB",
  clearImage: "Clear",
  saveChanges: "Save",
  category: "Category",
  priority: "Priority",
  selectDate: "Select Date",
  clearDate: "Clear",

  // Categories
  cat_work: "Work",
  cat_personal: "Personal",
  cat_study: "Study",
  cat_health: "Health",
  cat_finance: "Finance",
  cat_travel: "Travel",
  cat_home: "Home",
  cat_other: "Other",

  // Priorities
  pri_low: "Low",
  pri_medium: "Medium",
  pri_high: "High",
  pri_urgent: "Urgent",

  // Settings
  settings: "Settings",
  appearance: "APPEARANCE",
  light: "Light",
  dark: "Dark",
  system: "System",
  general: "GENERAL",
  profile: "Profile",
  manageProfile: "Manage your profile",
  notifications: "Notifications",
  configureAlerts: "Configure alerts and reminders",
  backupSync: "Backup & Sync",
  cloudBackup: "Cloud backup settings",
  resetData: "Reset Data",
  deleteAllData: "Delete all projects and tasks",
  resetAllData: "Reset All Data",
  resetConfirm: "This will delete all your projects and tasks. Are you sure?",
  cancel: "Cancel",
  reset: "Reset",
  done: "Done",
  resetSuccess:
    "All data has been reset. Pull down to refresh on the Home screen.",
  language: "LANGUAGE",
  activity: "ACTIVITY",
  borderRadius: "CORNER RADIUS",

  // Profile
  editProfile: "Edit Profile",
  yourName: "Your Name",
  enterYourName: "Enter your name",
  changeAvatar: "Change Avatar",
  chooseFromLibrary: "Choose from Library",
  removeAvatar: "Remove Avatar",
  save: "Save",
  home: "Home",

  // Tab
  tabSettings: "Settings",
  sharp: "Sharp",
  round: "Round",
  medium: "Medium",

  // Not Found
  screenNotExist: "This screen doesn't exist.",
  goHome: "Go to home screen!",
};

export type Translations = typeof en;

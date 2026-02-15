import { Redirect } from "expo-router";

// This screen is a dummy placeholder for the center tab button.
// The actual navigation to /new-project is handled via the tab bar's listener.
export default function NewProjectTab() {
  return <Redirect href="/" />;
}

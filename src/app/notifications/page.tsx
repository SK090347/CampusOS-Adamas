import { PrefsClient } from "./PrefsClient";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Notification preferences</h1>
        <p className="page-sub">Choose which CampusOS update categories you care about (demo prefs).</p>
      </div>
      <PrefsClient />
    </div>
  );
}

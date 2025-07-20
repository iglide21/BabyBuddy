import { NotificationsView } from "@/src/components/notifications-view";

const NotificationsPage = () => {
  return <NotificationsView onBack={() => setCurrentView("dashboard")} />;
};

export default NotificationsPage;

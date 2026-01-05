import Header from "@/components/Header";
import SwitchTabs from "@/components/Switching-Exam-Result-Pannels";

export default function HrPortalLayout({ children }) {
  return (
    <div className="p-6">
      <Header />
  {/* Tabs always visible */}
      <div className="mt-6">
        {children}     {/* Page content changes here */}
      </div>
    </div>
  );
}

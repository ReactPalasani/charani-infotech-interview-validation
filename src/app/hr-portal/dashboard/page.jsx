"use client";

import AddCollegeNameForm from "@/components/AddCollgeNamesForm";
import CollegesNamesList from "@/components/CollegeNamesList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("AdminLogin");

    if (!storedAdmin) {
      router.push("/hr-portal");
    } else {
      setAdmin(storedAdmin);
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <>
      {admin && (
        <div className="flex max-w-full gap-4">
          <div className="w-1/2">
            <AddCollegeNameForm />
          </div>

          <div className="w-1/2">
            <CollegesNamesList />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;

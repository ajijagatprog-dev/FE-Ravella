"use client";

import ProfilePageBase from "@/components/ProfilePageBase";

export default function AdminProfilePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ProfilePageBase role="admin" backUrl="/admin/dashboard" />
        </div>
    );
}

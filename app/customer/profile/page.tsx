"use client";

import ProfilePageBase from "@/components/ProfilePageBase";

export default function CustomerProfilePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ProfilePageBase role="customer" backUrl="/customer/dashboard" />
        </div>
    );
}

"use client";

import ProfilePageBase from "@/components/ProfilePageBase";

export default function B2BProfilePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ProfilePageBase role="b2b" backUrl="/b2b/dashboard" />
        </div>
    );
}

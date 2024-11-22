import React from "react";

export default function Section({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
            {children}
        </div>
    );
}
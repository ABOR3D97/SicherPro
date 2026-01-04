'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Approve() {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            window.location.href = `/api/admin/approve/${id}`;
        }
    }, [id]);

    return (
        <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
                <h1 className="text-4xl font-bold mb-6 text-[#587D85]">Bestätigung...</h1>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#587D85] mx-auto"></div>
            </div>
        </main>
    );
}
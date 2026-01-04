export default function Error() {
    return (
        <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
                <h1 className="text-4xl font-bold mb-6 text-red-600">Fehler</h1>
                <p className="text-xl text-[#3A3A3A]">Etwas ist schiefgelaufen. Versuchen Sie es später erneut.</p>
            </div>
        </main>
    );
}
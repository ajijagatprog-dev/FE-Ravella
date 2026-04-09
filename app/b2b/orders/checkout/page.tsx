import dynamic from "next/dynamic";


const CheckoutClient = dynamic(() => import("./components/CheckoutClient"), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
            <div className="h-8 w-8 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-stone-500 font-medium">Preparing secure checkout...</p>
        </div>
    )
});

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-800">
            <CheckoutClient />
        </div>
    );
}

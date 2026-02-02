'use client';

import { getStripe } from '@/utils/stripe/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    products: any[];
    organizationId: string;
}

export default function Pricing({ products, organizationId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (priceId: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ priceId, organizationId })
            });

            const { sessionId } = await response.json();
            const stripe = await getStripe();
            await (stripe as any)?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error(error);
            alert('Error redirecting to checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
                const price = product.prices?.[0];
                if (!price) return null;

                return (
                    <div key={product.id} className="glass-effect rounded-2xl p-8 flex flex-col h-full border border-slate-700/50 hover:border-accent-purple/50 transition-all">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-grow">{product.description}</p>

                        <div className="mb-6">
                            <span className="text-4xl font-bold">${(price.unit_amount / 100).toFixed(2)}</span>
                            <span className="text-slate-400">/{price.interval}</span>
                        </div>

                        <button
                            onClick={() => handleCheckout(price.id)}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-bold hover:shadow-lg hover:shadow-accent-purple/30 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Upgrade Now'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

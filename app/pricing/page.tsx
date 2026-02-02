import { getActiveProductsWithPrices } from '@/utils/stripe/queries';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Pricing from '@/components/Pricing';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default async function PricingPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

    if (!userOrg) {
        redirect('/onboarding');
    }

    const products = await getActiveProductsWithPrices();

    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64">
                <Header />
                <div className="p-8 space-y-8 max-w-6xl mx-auto">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-slate-400">
                            Choose the plan that's right for your business.
                        </p>
                    </div>

                    <Pricing products={products} organizationId={userOrg.organization_id} />
                </div>
            </main>
        </div>
    );
}

import { createClient } from '@/utils/supabase/server';

export const getSubscription = async (organizationId: string) => {
    const supabase = createClient();
    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .eq('organization_id', organizationId)
        .in('status', ['trialing', 'active'])
        .maybeSingle();

    return subscription;
};

export const getActiveProductsWithPrices = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*, prices(*)')
        .eq('active', true)
        .eq('prices.active', true)
        .order('metadata->index')
        .order('unit_amount', { foreignTable: 'prices' });

    return data || [];
};

import { stripe } from './config';
import { createClient } from '@supabase/supabase-js';

// Note: Use service role key for webhook operations to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const upsertProductRecord = async (product: any) => {
    const productData = {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? null,
        image: product.images?.[0] ?? null,
        metadata: product.metadata
    };

    const { error } = await supabaseAdmin.from('products').upsert([productData]);
    if (error) throw error;
    console.log(`Product inserted/updated: ${product.id}`);
};

export const upsertPriceRecord = async (price: any) => {
    const priceData = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : price.product.id,
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? null,
        type: price.type,
        unit_amount: price.unit_amount ?? null,
        interval: price.recurring?.interval ?? null,
        interval_count: price.recurring?.interval_count ?? null,
        trial_period_days: price.recurring?.trial_period_days ?? null,
        metadata: price.metadata
    };

    const { error } = await supabaseAdmin.from('prices').upsert([priceData]);
    if (error) throw error;
    console.log(`Price inserted/updated: ${price.id}`);
};

export const createOrRetrieveCustomer = async ({
    organization_id,
    email
}: {
    organization_id: string;
    email: string;
}) => {
    const { data, error } = await supabaseAdmin
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', organization_id)
        .single();

    if (error || !data?.stripe_customer_id) {
        // Create new customer in Stripe
        const customerData = {
            metadata: { organizationId: organization_id },
            email: email
        };
        const customer = await stripe.customers.create(customerData);

        // Insert into Supabase
        const { error: supabaseError } = await supabaseAdmin
            .from('customers')
            .insert([{ id: organization_id, stripe_customer_id: customer.id }]);

        if (supabaseError) throw supabaseError;
        return customer.id;
    }

    return data.stripe_customer_id;
};

export const manageSubscriptionStatusChange = async (
    subscriptionId: string,
    customerId: string,
    createAction = false
) => {
    // Get customer's organization_id from mapping table
    const { data: customerData, error: noCustomerError } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (noCustomerError) throw noCustomerError;

    const organization_id = customerData.id;

    const subscription = (await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    })) as any;

    const subscriptionData = {
        id: subscription.id,
        organization_id: organization_id,
        metadata: subscription.metadata,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        quantity: subscription.quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        created: new Date(subscription.created * 1000).toISOString(),
        ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    };

    const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert([subscriptionData]);

    if (error) throw error;
    console.log(`Inserted/updated subscription [${subscription.id}] for organization [${organization_id}]`);
};

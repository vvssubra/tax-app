import { stripe } from '@/utils/stripe/config';
import { createOrRetrieveCustomer } from '@/utils/stripe/server';
import { getURL } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { priceId, organizationId } = await req.json();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Retrieve the customer from Stripe
        const customer = await createOrRetrieveCustomer({
            organization_id: organizationId,
            email: user.email || ''
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer,
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            subscription_data: {
                metadata: {
                    organizationId
                }
            },
            success_url: `${getURL()}/dashboard`,
            cancel_url: `${getURL()}/`
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.log(err);
        return new Response(err.message, { status: 500 });
    }
}

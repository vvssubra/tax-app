export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            organizations: {
                Row: {
                    id: string
                    name: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            user_organizations: {
                Row: {
                    id: string
                    user_id: string
                    organization_id: string
                    role: 'owner' | 'admin' | 'member' | 'viewer'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    organization_id: string
                    role?: 'owner' | 'admin' | 'member' | 'viewer'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    organization_id?: string
                    role?: 'owner' | 'admin' | 'member' | 'viewer'
                    created_at?: string
                }
            }
            expenses: {
                Row: {
                    id: string
                    organization_id: string
                    status: 'pending' | 'paid' | 'approved' | 'rejected' | null
                    receipt_date: string
                    receipt_id: string | null
                    vendor_merchant: string
                    total_amount: number
                    description: string | null
                    payment_method: string | null
                    category: string
                    created_at: string
                    created_by: string | null
                }
            }
            income: {
                Row: {
                    id: string
                    organization_id: string
                    status: 'pending' | 'received' | 'invoiced' | 'cancelled' | null
                    payment_date: string
                    total_amount: number
                    description: string | null
                    category: string
                }
            }
        }
        Views: {
            cashflow_monthly: {
                Row: {
                    organization_id: string
                    month: string
                    total_income: number
                    total_expenses: number
                    net_cashflow: number
                }
            }
            cashflow_detailed: {
                Row: {
                    organization_id: string
                    month: string
                    transaction_type: 'income' | 'expense'
                    category: string
                    amount: number
                }
            }
        }
    }
}

-- Habilitar extensión pgcrypto para gen_random_uuid() si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabla: hosting_plans
CREATE TABLE IF NOT EXISTS public.hosting_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price_ars NUMERIC(10, 2) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    billing_cycle TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla: hosting_clients
CREATE TABLE IF NOT EXISTS public.hosting_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    domain TEXT NOT NULL,
    plan_id UUID NOT NULL REFERENCES public.hosting_plans(id) ON DELETE RESTRICT,
    custom_price_override NUMERIC(10, 2),
    currency TEXT NOT NULL CHECK (currency IN ('ARS', 'USD')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice crítico para optimizar consultas del Vercel Cron
CREATE INDEX IF NOT EXISTS idx_hosting_clients_expiration_date ON public.hosting_clients(expiration_date);

-- 3. Tabla: payment_history
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.hosting_clients(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('ARS', 'USD')),
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

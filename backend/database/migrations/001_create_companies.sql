
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    legal_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    website VARCHAR(500),
    logo_url VARCHAR(500),
    country VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
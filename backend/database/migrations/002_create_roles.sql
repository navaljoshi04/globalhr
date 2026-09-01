

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_roles_company 
        FOREIGN KEY (company_id)
        REFERENCES companies(id) 
        ON DELETE CASCADE ,
    
    CONSTRAINT uq_roles_company_name 
         UNIQUE (company_id, name)
);
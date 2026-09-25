create extension if not exists  "pgcrypto";
 
create table if not exists companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(250) NOT NULL,
  slug VARCHAR(250),
  legal_name VARCHAR(250),
  email VARCHAR(250),
  website VARCHAR(500),
  logo_url VARCHAR(500),
  country VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table if not exists roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_roles_company_name UNIQUE (company_id, name)
);

create table if not exists users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT uq_user_company_employee_code UNIQUE (company_id, employee_code),
  designation_id UUID REFERENCES designations(id) ON DELETE SET NULL,
  reporting_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  super_manager_id UUID REFERENCES users(id) ON DELETE SET NULL;
);



create table if not exists  departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_department_company_name UNIQUE (company_id, name)
);


create table if not exists designations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_designation_company_title UNIQUE (company_id, title)
);


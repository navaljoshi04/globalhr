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

create type leave_status_enum as enum ('pending', 'manager_approved', 'approved', 'rejected', 'cancelled');
create type approval_status_enum as enum ('pending', 'approved', 'rejected');

create table if not exists leave_types (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name varchar(100) not null, 
  description varchar(255),
  max_days_per_year int default 12,
  created_at timestamptz not null default now(),
  constraint uq_leave_type_company_name unique (company_id, name)
);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  leave_type_id uuid not null references leave_types(id) on delete restrict,
  
  -- Leave duration details
  start_date date not null,
  end_date date not null,
  total_days numeric(4, 1) not null, -- allows half days like 0.5 or 1.5
  reason text not null,
  
  -- Overall Lifecycle Status
  status varchar(30) not null default 'pending', -- 'pending', 'manager_approved', 'approved', 'rejected', 'cancelled'
  
  -- Manager Approval Tracking
  manager_status varchar(30) not null default 'pending', -- 'pending', 'approved', 'rejected'
  manager_id uuid references users(id) on delete set null, -- The manager who took the action
  manager_action_at timestamptz,
  manager_comments text,
  
  -- HR Approval Tracking
  hr_status varchar(30) not null default 'pending', -- 'pending', 'approved', 'rejected'
  hr_id uuid references users(id) on delete set null, -- The HR admin who took the final action
  hr_action_at timestamptz,
  hr_comments text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table if not exists leave_balances(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  leave_type_id uuid not null references leave_types(id) on delete cascade,
  year int not null default extract(year from current_date),
  total_allocated numeric(4, 1) not null default 0.0,         -- Total leaves allotted (e.g., 12.0)
  used_leaves numeric(4, 1) not null default 0.0,             -- Kitni use/approve ho chuki hain
  pending_leaves numeric(4, 1) not null default 0.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_leave_type_year unique (user_id, leave_type_id, year)
);

-- Indexing for performance on frequent tenant and employee queries
create index if not idx_leave_requests_company on leave_requests(company_id);
create index if not idx_leave_requests_user on leave_requests(user_id);
create index if not idx_leave_requests_status on leave_requests(status);
create index if not idx_leave_balances_company on leave_balances(company_id);
create index if not idx_leave_balances_user on leave_balances(user_id);
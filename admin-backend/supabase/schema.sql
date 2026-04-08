-- BNB Prayagraj Admin API Database Schema
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(300),
    venue VARCHAR(200),
    address VARCHAR(500),
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    capacity INTEGER,
    registered_count INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    registration_link VARCHAR(500),
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10, 2),
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_display_order ON events(display_order);
CREATE INDEX idx_events_is_featured ON events(is_featured);

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    location VARCHAR(200),
    type VARCHAR(20) DEFAULT 'volunteer' CHECK (type IN ('full-time', 'part-time', 'internship', 'volunteer')),
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    skills_required TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    application_deadline TIMESTAMPTZ,
    vacancies INTEGER,
    applications_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roles_status ON roles(status);
CREATE INDEX idx_roles_type ON roles(type);
CREATE INDEX idx_roles_display_order ON roles(display_order);
CREATE INDEX idx_roles_is_featured ON roles(is_featured);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    bio TEXT,
    image_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    twitter_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    year_of_study INTEGER,
    college VARCHAR(200),
    skills TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_is_active ON team_members(is_active);
CREATE INDEX idx_team_members_display_order ON team_members(display_order);
CREATE INDEX idx_team_members_department ON team_members(department);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(300),
    image_url VARCHAR(500),
    demo_url VARCHAR(500),
    github_url VARCHAR(500),
    technologies TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    team_members UUID[] DEFAULT '{}',
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);

-- ============================================
-- CONTACTS TABLE (Public submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_is_read ON contacts(is_read);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- ============================================
-- JOIN APPLICATIONS TABLE (Public submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS join_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(200) NOT NULL,
    year_of_study INTEGER,
    department VARCHAR(100),
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    motivation TEXT,
    experience TEXT,
    referral_source VARCHAR(200),
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'archived')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_join_applications_status ON join_applications(status);
CREATE INDEX idx_join_applications_email ON join_applications(email);
CREATE INDEX idx_join_applications_created_at ON join_applications(created_at);

-- ============================================
-- EVENT REGISTRATIONS TABLE (Public submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    event_title VARCHAR(200),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(200),
    year_of_study INTEGER,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(email);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);
CREATE INDEX idx_event_registrations_created_at ON event_registrations(created_at);

-- ============================================
-- ROLE APPLICATIONS TABLE (Public submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS role_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    role_title VARCHAR(200),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(200),
    year_of_study INTEGER,
    resume_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    cover_letter TEXT,
    relevant_experience TEXT,
    availability TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'archived')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_role_applications_role_id ON role_applications(role_id);
CREATE INDEX idx_role_applications_email ON role_applications(email);
CREATE INDEX idx_role_applications_status ON role_applications(status);
CREATE INDEX idx_role_applications_created_at ON role_applications(created_at);

-- ============================================
-- FEEDBACK TABLE (Public submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    email VARCHAR(255),
    type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('general', 'event', 'website', 'suggestion', 'complaint', 'appreciation')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    event_title VARCHAR(200),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'actioned', 'archived')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_event_id ON feedback(event_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_join_applications_updated_at BEFORE UPDATE ON join_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_applications_updated_at BEFORE UPDATE ON role_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO UPDATE REGISTERED_COUNT ON EVENTS
-- ============================================
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET registered_count = GREATEST(registered_count - 1, 0) WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registered_count_trigger
AFTER INSERT OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_registered_count();

-- ============================================
-- FUNCTION TO UPDATE APPLICATIONS_COUNT ON ROLES
-- ============================================
CREATE OR REPLACE FUNCTION update_role_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE roles SET applications_count = applications_count + 1 WHERE id = NEW.role_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE roles SET applications_count = GREATEST(applications_count - 1, 0) WHERE id = OLD.role_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_count_trigger
AFTER INSERT OR DELETE ON role_applications
    FOR EACH ROW EXECUTE FUNCTION update_role_applications_count();

-- ============================================
-- SEED INITIAL SUPER ADMIN USER
-- ============================================
-- Password: 'admin123456' (change immediately after first login)
-- This is a placeholder - in production, create this manually
-- INSERT INTO admin_users (email, password_hash, name, role)
-- VALUES (
--     'admin@bnbprayagraj.com',
--     '$2b$10$dummyHashForInitialSetupReplaceThis',
--     'Super Admin',
--     'super_admin'
-- );
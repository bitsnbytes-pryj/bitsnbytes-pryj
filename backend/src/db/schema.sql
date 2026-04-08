-- =============================================
-- Bits&Bytes Prayagraj Public API Database Schema
-- =============================================
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PUBLIC DATA TABLES
-- =============================================

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    image_url VARCHAR(500),
    event_date DATE NOT NULL,
    event_time TIME,
    end_time TIME,
    location VARCHAR(255),
    location_url VARCHAR(500),
    is_online BOOLEAN DEFAULT FALSE,
    online_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    registration_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles Table (Open positions)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    responsibilities TEXT[],
    requirements TEXT[],
    benefits TEXT[],
    time_commitment VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    image_url VARCHAR(500),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    technologies TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'on-hold')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FORM SUBMISSION TABLES
-- =============================================

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Join Applications
CREATE TABLE IF NOT EXISTS join_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    interests TEXT[] DEFAULT '{}',
    experience VARCHAR(50) CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
    why_join TEXT,
    how_heard VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    organization VARCHAR(255),
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, email)
);

-- Role Applications
CREATE TABLE IF NOT EXISTS role_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    portfolio_url VARCHAR(500),
    resume_url VARCHAR(500),
    cover_letter TEXT,
    linkedin_url VARCHAR(500),
    availability VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Submissions
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    feedback_type VARCHAR(50) DEFAULT 'general' CHECK (feedback_type IN ('general', 'event', 'website', 'suggestion', 'complaint', 'appreciation')),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'addressed')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_active ON roles(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_slug ON roles(slug);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(display_order);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Contact submissions index
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);

-- Join applications indexes
CREATE INDEX IF NOT EXISTS idx_join_status ON join_applications(status);
CREATE INDEX IF NOT EXISTS idx_join_email ON join_applications(email);

-- Event registrations indexes
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_email ON event_registrations(email);

-- Role applications indexes
CREATE INDEX IF NOT EXISTS idx_role_app_role ON role_applications(role_id);
CREATE INDEX IF NOT EXISTS idx_role_app_email ON role_applications(email);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public read policies (for published/active content)
CREATE POLICY "Public read events" ON events FOR SELECT USING (status != 'cancelled');
CREATE POLICY "Public read active roles" ON roles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read active team" ON team_members FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (TRUE);

-- Service role has full access (for backend API)
-- Note: When using service_role key, RLS is bypassed
-- So no additional policies needed for backend operations

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - Remove in production)
-- =============================================

-- Sample Event
-- INSERT INTO events (title, slug, description, event_date, event_time, location, status, tags)
-- VALUES (
--     'Introduction to Web Development',
--     'intro-web-dev-2024',
--     'Join us for an introduction to web development basics.',
--     '2024-03-15',
--     '14:00:00',
--     'Online via Google Meet',
--     'upcoming',
--     ARRAY['web', 'beginner', 'javascript']
-- );

-- Sample Role
-- INSERT INTO roles (title, slug, description, is_active)
-- VALUES (
--     'Community Manager',
--     'community-manager',
--     'Help grow and engage our developer community.',
--     TRUE
-- );

-- Sample Team Member
-- INSERT INTO team_members (name, role, bio, display_order, is_active)
-- VALUES (
--     'John Doe',
--     'Founder & Lead Organizer',
--     'Passionate about building developer communities.',
--     1,
--     TRUE
-- );

-- Sample Project
-- INSERT INTO projects (title, slug, description, status, technologies)
-- VALUES (
--     'Community Website',
--     'community-website',
--     'The official website for Bits&Bytes Prayagraj.',
--     'active',
--     ARRAY['Next.js', 'TypeScript', 'TailwindCSS']
-- );
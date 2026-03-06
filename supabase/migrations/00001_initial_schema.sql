-- Initial schema for RutgersPlan
-- Run this in the Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  major_primary TEXT,
  major_secondary TEXT,
  grad_year INTEGER,
  years_to_complete INTEGER,   -- 1, 2, 3, or 4
  gpa_goal DECIMAL(3,2),
  credits_completed INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses catalog
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT UNIQUE,     -- e.g. "01:750:203"
  title TEXT,
  credits INTEGER,
  department TEXT,
  description TEXT,
  is_easy_a BOOLEAN DEFAULT false,
  difficulty_rating DECIMAL(3,2),
  category TEXT,               -- 'SAS Core', 'Major', 'Elective'
  fulfills TEXT[],
  has_cc_equivalent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Easy A course swaps
CREATE TABLE course_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_course_id UUID REFERENCES courses(id),
  easier_course_id UUID REFERENCES courses(id),
  reason TEXT,
  verified BOOLEAN DEFAULT false
);

-- Community college equivalencies
CREATE TABLE cc_equivalencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rutgers_course_id UUID REFERENCES courses(id),
  cc_name TEXT,
  cc_course_code TEXT,
  cc_course_title TEXT,
  is_verified BOOLEAN DEFAULT false,
  notes TEXT
);

-- User plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT DEFAULT 'My 4-Year Plan',
  is_active BOOLEAN DEFAULT true,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses in plans (semester assignments)
CREATE TABLE plan_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  year INTEGER,                -- 1, 2, 3, or 4
  semester TEXT,               -- 'Fall', 'Spring', 'Summer'
  status TEXT DEFAULT 'planned',
  grade TEXT
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own plans" ON plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own plan courses" ON plan_courses FOR ALL
  USING (plan_id IN (SELECT id FROM plans WHERE user_id = auth.uid()));

CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read swaps" ON course_swaps FOR SELECT USING (true);
CREATE POLICY "Public read cc" ON cc_equivalencies FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plan_courses_plan_id ON plan_courses(plan_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_is_easy_a ON courses(is_easy_a);
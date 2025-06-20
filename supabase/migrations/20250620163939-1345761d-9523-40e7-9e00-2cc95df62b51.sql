
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('student', 'parent', 'admin', 'teacher')) DEFAULT 'student',
  school_level TEXT CHECK (school_level IN ('primaire', 'college', 'lycee', 'universite', 'professionnel')),
  region TEXT,
  school_name TEXT,
  language_preference TEXT DEFAULT 'fr' CHECK (language_preference IN ('fr', 'wo', 'bm')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('finance', 'technology', 'general')) NOT NULL,
  level TEXT CHECK (level IN ('debutant', 'intermediaire', 'essentiel', 'avance')) NOT NULL,
  duration_minutes INTEGER,
  is_premium BOOLEAN DEFAULT false,
  price_fcfa INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  content JSONB, -- Structured content with modules, quizzes, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_modules JSONB DEFAULT '[]',
  quiz_scores JSONB DEFAULT '{}',
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create virtual classes table
CREATE TABLE public.virtual_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  school_name TEXT,
  level TEXT,
  region TEXT,
  teacher_id UUID REFERENCES auth.users(id),
  class_code TEXT UNIQUE NOT NULL,
  max_students INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class memberships table
CREATE TABLE public.class_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.virtual_classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, student_id)
);

-- Create parent-child relationships table
CREATE TABLE public.parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'parent' CHECK (relationship_type IN ('parent', 'tutor', 'guardian')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- Create achievements/badges table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  badge_type TEXT CHECK (badge_type IN ('completion', 'streak', 'quiz_master', 'fast_learner', 'community')),
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  course_id UUID REFERENCES public.courses(id) -- Optional: achievement related to specific course
);

-- Create quiz sessions table for live challenges
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.virtual_classes(id),
  course_id UUID REFERENCES public.courses(id),
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  duration_minutes INTEGER DEFAULT 10,
  is_live BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz responses table
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken_seconds INTEGER,
  UNIQUE(quiz_session_id, user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('motivation', 'reminder', 'achievement', 'class_update', 'parent_report')) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: users can view and update their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: everyone can view courses, only admins can modify
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

-- User progress: users can view and update their own progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Virtual classes: members can view their classes
CREATE POLICY "Users can view their classes" ON public.virtual_classes
  FOR SELECT USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM public.class_memberships 
      WHERE class_id = id AND student_id = auth.uid() AND is_active = true
    )
  );

-- Class memberships: users can view their memberships
CREATE POLICY "Users can view their class memberships" ON public.class_memberships
  FOR SELECT USING (auth.uid() = student_id);

-- Parent-child relationships: parents and children can view their relationships
CREATE POLICY "Users can view their family relationships" ON public.parent_child_relationships
  FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Achievements: users can view their own achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Quiz sessions: class members can view their quiz sessions
CREATE POLICY "Users can view their quiz sessions" ON public.quiz_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_memberships 
      WHERE class_id = quiz_sessions.class_id AND student_id = auth.uid() AND is_active = true
    ) OR
    auth.uid() = created_by
  );

-- Quiz responses: users can view and create their own responses
CREATE POLICY "Users can view their own quiz responses" ON public.quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz responses" ON public.quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample courses
INSERT INTO public.courses (title, description, category, level, duration_minutes, is_premium, price_fcfa, content) VALUES
('Connaître sa monnaie (FCFA)', 'Comprendre l''inflation, les taux de change et l''économie locale', 'finance', 'debutant', 150, false, 0, '{"modules": [{"title": "Introduction au FCFA", "content": "Histoire et importance de la monnaie FCFA"}, {"title": "Inflation et pouvoir d''achat", "content": "Comment l''inflation affecte votre argent"}]}'),
('Gérer son argent au quotidien', 'Épargne, budget, gestion des dettes - méthodes pratiques', 'finance', 'intermediaire', 195, true, 2500, '{"modules": [{"title": "Créer un budget personnel", "content": "Méthodes pour établir un budget efficace"}, {"title": "Techniques d''épargne", "content": "Comment économiser même avec un petit salaire"}]}'),
('Services financiers africains', 'Banques, fintech, microfinance, Orange Money, Wave', 'finance', 'debutant', 165, false, 0, '{"modules": [{"title": "Mobile Money", "content": "Utiliser Orange Money et Wave en sécurité"}, {"title": "Banques et microfinance", "content": "Choisir la bonne institution financière"}]}'),
('Éviter les arnaques financières', 'Reconnaissance et prévention des fraudes financières', 'finance', 'essentiel', 90, false, 0, '{"modules": [{"title": "Identifier les arnaques", "content": "Reconnaître les signaux d''alarme"}, {"title": "Se protéger", "content": "Mesures de sécurité essentielles"}]}'),
('IA au quotidien en Afrique', 'Applications pratiques de l''intelligence artificielle', 'technology', 'debutant', 135, false, 0, '{"modules": [{"title": "Qu''est-ce que l''IA ?", "content": "Introduction accessible à l''intelligence artificielle"}, {"title": "IA dans l''agriculture", "content": "Applications concrètes en Afrique"}]}'),
('Blockchain & Crypto simplifiées', 'Comprendre la blockchain et les cryptomonnaies', 'technology', 'intermediaire', 180, true, 3000, '{"modules": [{"title": "Bases de la blockchain", "content": "Technologie blockchain expliquée simplement"}, {"title": "Cryptomonnaies en Afrique", "content": "Opportunités et risques"}]}'),
('Sécurité numérique', 'Protection de l''identité et sécurité en ligne', 'technology', 'essentiel', 150, false, 0, '{"modules": [{"title": "Mots de passe sécurisés", "content": "Créer et gérer des mots de passe forts"}, {"title": "Navigation sécurisée", "content": "Éviter les pièges du web"}]}');


-- Créer un enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'teacher', 'student');

-- Créer la table des rôles utilisateur
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE (user_id, role)
);

-- Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier les rôles (évite la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Fonction pour obtenir le rôle le plus élevé d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_highest_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
    AND is_active = true
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'teacher' THEN 3
      WHEN 'student' THEN 4
    END
  LIMIT 1
$$;

-- Politique RLS pour user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Mettre à jour les politiques des cours pour les admins
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admins and teachers can create courses" ON public.courses
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Admins and course creators can update courses" ON public.courses
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    (created_by = auth.uid() AND public.has_role(auth.uid(), 'teacher'))
  );

CREATE POLICY "Admins can delete courses" ON public.courses
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Ajouter une colonne role dans profiles pour faciliter l'accès
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'student';

-- Fonction pour synchroniser le rôle dans profiles
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET role = public.get_user_highest_role(NEW.user_id)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour synchroniser automatiquement
CREATE TRIGGER sync_profile_role
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_role();

-- Créer le premier admin (utilise l'utilisateur actuel)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role, assigned_at)
    SELECT id, 'admin', now()
    FROM auth.users
    ORDER BY created_at
    LIMIT 1
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

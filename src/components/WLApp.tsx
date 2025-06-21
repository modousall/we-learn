
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthForm } from './auth/AuthForm';
import { Dashboard } from './dashboard/Dashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { CourseViewer } from './course/CourseViewer';

export const WLApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'admin'>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUserProfile(profile);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/8aff2116-7caa-4844-ab1a-8bb8c8474859.png" 
            alt="We Learn Logo" 
            className="h-20 w-20 mx-auto mb-4 animate-pulse"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de We Learn...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return <AuthForm />;
  }

  // Check if user is admin
  const isAdmin = userProfile?.user_type === 'admin';

  // Show admin dashboard for admin users
  if (isAdmin && currentView === 'dashboard') {
    return <AdminDashboard user={user} />;
  }

  // Show course viewer
  if (currentView === 'course' && selectedCourseId) {
    return (
      <CourseViewer
        courseId={selectedCourseId}
        user={user}
        onClose={handleBackToDashboard}
      />
    );
  }

  // Show regular dashboard
  return (
    <Dashboard 
      user={user} 
      onCourseSelect={handleCourseSelect}
    />
  );
};

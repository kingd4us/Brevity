// src/pages/PublicProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfile, type PublicProfile } from '../services/api';
import { ICONS_MAP } from '../components/IconMap';

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        setError('Profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const hasContent = profile && (profile.links.length > 0 || profile.socialLinks.length > 0);

  return (
    <div className="max-w-lg mx-auto mt-4 sm:mt-8 px-4">
      <div className="bg-surface rounded-xl shadow-[8px_8px_0px_#1A1A1A] border-2 border-border p-6 text-center">
        <img
          src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${profile?.username}`}
          alt={profile?.username}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-black"
        />
        <h1 className="text-2xl font-bold text-text mb-1">@{profile?.username}</h1>
        {profile?.bio && <p className="text-gray-600 mb-6 px-4">{profile.bio}</p>}
        
        {!hasContent ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
            <p>This user hasn't added any links yet.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {profile?.links.sort((a, b) => a.position - b.position).map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-text font-semibold py-3 px-5 rounded-md border-2 border-border
                             shadow-[4px_4px_0px_#1A1A1A] hover:bg-muted hover:shadow-[2px_2px_0px_#1A1A1A]
                             active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A1A1A]
                             transition-all duration-150 text-center"
                >
                  {link.title}
                </a>
              ))}
            </div>
            
            {profile?.socialLinks && profile.socialLinks.length > 0 && (
              <div className="flex justify-center gap-6 mt-6">
                {profile.socialLinks.map((social) => {
                  const iconInfo = ICONS_MAP[social.iconName];
                  if (!iconInfo) return null;
                  
                  const IconComponent = iconInfo.component;
                  return (
                    <a 
                      key={social._id} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${iconInfo.color} ${iconInfo.hoverColor} transition-colors`}
                    >
                      <IconComponent size={28} />
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
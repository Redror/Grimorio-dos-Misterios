
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Social from './Social';

interface ProfileProps {
  currentUser: UserProfile;
  updateUser: (u: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, updateUser, onLogout }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.avatar || null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!avatarPreview) return;

    // Update in DB
    const dbKey = 'lom-users-db';
    const usersStr = localStorage.getItem(dbKey);
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const updatedUser = { ...users[currentUser.username], avatar: avatarPreview };
      users[currentUser.username] = updatedUser;
      localStorage.setItem(dbKey, JSON.stringify(users));
      
      // Update in App State
      updateUser(updatedUser);
      setNotification("Perfil atualizado com sucesso!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {notification && (
        <div className="bg-green-900/50 border border-green-500/50 text-green-300 px-4 py-3 rounded text-center text-sm font-bold mb-4">
          {notification}
        </div>
      )}

      {/* Header Row */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-mystic-gold mb-1">Perfil de Usuário</h2>
          <p className="text-stone-500 text-sm italic">"Sua face no mundo desperto e suas conexões."</p>
        </div>
        <button 
             onClick={onLogout}
             className="border border-red-900/50 text-red-500 hover:bg-red-900/20 px-4 py-2 rounded uppercase tracking-widest text-xs font-bold transition-colors"
           >
             Logout
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
         {/* Left Column: ID Card */}
         <div className="xl:col-span-5 space-y-6">
            <div className="bg-mystic-800 p-8 rounded-lg border border-stone-800 shadow-2xl relative overflow-hidden h-full">
               {/* Decorative ID Card Background Elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-mystic-gold/5 rounded-bl-full"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-mystic-gold/5 rounded-tr-full"></div>

               <h3 className="text-mystic-gold font-serif text-lg mb-6 border-b border-mystic-gold/10 pb-2 text-center relative z-10">Cartão de Identificação</h3>

               <div className="flex flex-col items-center gap-6 relative z-10">
                  {/* Avatar Section */}
                  <div className="relative group">
                     <div className="w-32 h-32 rounded-full border-4 border-mystic-gold/30 bg-stone-900 overflow-hidden shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-stone-600 font-serif font-bold">
                            {currentUser.username[0].toUpperCase()}
                          </div>
                        )}
                     </div>
                     <label className="absolute bottom-0 right-0 bg-mystic-gold text-mystic-900 p-2 rounded-full cursor-pointer hover:bg-white transition-colors shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                  </div>

                  {/* Info Section */}
                  <div className="text-center space-y-2">
                     <h3 className="text-3xl font-serif text-white">{currentUser.username}</h3>
                     <span className="inline-block bg-black/40 border border-stone-700 px-3 py-1 rounded text-mystic-gold font-mono text-sm tracking-widest">
                       #{currentUser.tag}
                     </span>
                  </div>

                  {/* Actions */}
                  <div className="w-full space-y-4 pt-6 border-t border-stone-700/50 mt-2">
                     {avatarPreview !== currentUser.avatar && (
                       <button 
                         onClick={handleSaveProfile}
                         className="w-full bg-mystic-gold text-mystic-900 font-bold py-3 rounded hover:bg-white transition-colors uppercase tracking-widest text-xs shadow-lg mb-4"
                       >
                         Salvar Alterações
                       </button>
                     )}

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-mystic-900/50 p-3 rounded border border-stone-800 text-center">
                           <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Amigos</span>
                           <span className="text-xl font-bold text-stone-300">{currentUser.friends.length}</span>
                        </div>
                        <div className="bg-mystic-900/50 p-3 rounded border border-stone-800 text-center">
                           <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Status</span>
                           <span className="text-xs font-bold text-green-500 uppercase">Online</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Social Features */}
         <div className="xl:col-span-7">
            <Social currentUser={currentUser} updateUser={updateUser} isSidebar={false} />
         </div>
      </div>
    </div>
  );
};

export default Profile;

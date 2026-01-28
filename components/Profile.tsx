
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Social from './Social';

interface ProfileProps {
  currentUser: UserProfile;
  updateUser: (u: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, updateUser, onLogout }) => {
  // Inicializamos com o avatar atual ou undefined para evitar disparos falsos no comparador
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(currentUser.avatar);
  const [notification, setNotification] = useState<string | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);

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
    <div className="space-y-6 pb-20 animate-fadeIn relative">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-green-900 border border-green-500 text-green-300 px-6 py-2 rounded-full font-bold shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      {/* Social Modal Window */}
      {showSocialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSocialModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-mystic-900 border-2 border-mystic-gold/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 border-b border-mystic-gold/20 flex justify-between items-center bg-mystic-800">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-mystic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-xl font-serif text-mystic-gold uppercase tracking-widest">Círculo Social</h3>
              </div>
              <button 
                onClick={() => setShowSocialModal(false)}
                className="text-stone-500 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <Social currentUser={currentUser} updateUser={updateUser} isSidebar={false} />
            </div>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-mystic-gold mb-1">Perfil de Usuário</h2>
          <p className="text-stone-500 text-sm italic">"Sua face no mundo desperto e suas conexões."</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSocialModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded uppercase tracking-widest text-xs font-bold transition-all border border-mystic-gold/40 text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 shadow-[0_0_10px_rgba(197,160,89,0.1)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Ver Círculo Social
          </button>
          <button 
               onClick={onLogout}
               className="border border-red-900/50 text-red-500 hover:bg-red-900/20 px-4 py-2 rounded uppercase tracking-widest text-xs font-bold transition-colors"
             >
               Logout
          </button>
        </div>
      </div>

      <div className="flex justify-center">
         {/* ID Card Display */}
         <div className="w-full max-w-2xl space-y-6">
            <div className="bg-mystic-800 p-8 rounded-lg border border-stone-800 shadow-2xl relative overflow-hidden">
               {/* Decorative ID Card Background Elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-mystic-gold/5 rounded-bl-full"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-mystic-gold/5 rounded-tr-full"></div>

               <h3 className="text-mystic-gold font-serif text-lg mb-6 border-b border-mystic-gold/10 pb-2 text-center relative z-10 font-bold uppercase tracking-widest">Cartão de Identificação</h3>

               <div className="flex flex-col items-center gap-6 relative z-10">
                  {/* Avatar Section */}
                  <div className="relative group">
                     <div className="w-40 h-40 rounded-full border-4 border-mystic-gold/30 bg-stone-900 overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl text-stone-600 font-serif font-bold">
                            {currentUser.username[0].toUpperCase()}
                          </div>
                        )}
                     </div>
                     <label className="absolute bottom-1 right-1 bg-mystic-gold text-mystic-900 p-2.5 rounded-full cursor-pointer hover:bg-white transition-colors shadow-lg border-2 border-mystic-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                  </div>

                  {/* Info Section */}
                  <div className="text-center space-y-2">
                     <h3 className="text-4xl font-serif text-white">{currentUser.username}</h3>
                     <span className="inline-block bg-black/40 border border-stone-700 px-4 py-1.5 rounded text-mystic-gold font-mono text-lg tracking-widest">
                       #{currentUser.tag}
                     </span>
                  </div>

                  {/* Actions */}
                  <div className="w-full space-y-4 pt-6 border-t border-stone-700/50 mt-2">
                     {/* Só mostramos o botão se houver um preview E for diferente do avatar atual */}
                     {avatarPreview && avatarPreview !== currentUser.avatar && (
                       <button 
                         onClick={handleSaveProfile}
                         className="w-full bg-mystic-gold text-mystic-900 font-extrabold py-3 rounded hover:bg-white transition-all transform hover:scale-[1.02] uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,160,89,0.3)] mb-4"
                       >
                         Confirmar Nova Face
                       </button>
                     )}

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-mystic-900/50 p-4 rounded border border-stone-800 text-center group hover:border-mystic-gold/30 transition-colors">
                           <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Conexões</span>
                           <span className="text-2xl font-bold text-stone-300 group-hover:text-mystic-gold transition-colors">{currentUser.friends.length}</span>
                        </div>
                        <div className="bg-mystic-900/50 p-4 rounded border border-stone-800 text-center">
                           <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Status</span>
                           <div className="flex items-center justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              <span className="text-sm font-bold text-green-500 uppercase">Acordado</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;

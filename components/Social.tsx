
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SocialProps {
  currentUser: UserProfile;
  updateUser: (u: UserProfile) => void;
  isSidebar?: boolean;
}

const Social: React.FC<SocialProps> = ({ currentUser, updateUser, isSidebar = false }) => {
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleAddFriend = () => {
    setMessage(null);
    if (!searchName || !searchTag) {
      setMessage({ type: 'error', text: 'Preencha o Nome e a Tag.' });
      return;
    }

    if (searchName === currentUser.username && searchTag === currentUser.tag) {
       setMessage({ type: 'error', text: 'Você não pode adicionar a si mesmo.' });
       return;
    }

    // Check if already friends
    if (currentUser.friends.some(f => f.name === searchName && f.tag === searchTag)) {
       setMessage({ type: 'error', text: 'Este usuário já está na sua lista.' });
       return;
    }

    // Lookup in database
    const dbKey = 'lom-users-db';
    const usersStr = localStorage.getItem(dbKey);
    const users: Record<string, UserProfile> = usersStr ? JSON.parse(usersStr) : {};

    const targetUser = users[searchName];

    if (targetUser && targetUser.tag === searchTag) {
      // Success - Add to local state and update DB
      const updatedUser = {
        ...currentUser,
        friends: [...currentUser.friends, { name: targetUser.username, tag: targetUser.tag }]
      };
      
      // Update global user list (persist the friend addition for the current user in DB)
      users[currentUser.username] = updatedUser;
      localStorage.setItem(dbKey, JSON.stringify(users));
      
      // Update app state
      updateUser(updatedUser);
      setMessage({ type: 'success', text: `${targetUser.username} foi adicionado!` });
      setSearchName('');
      setSearchTag('');
    } else {
      setMessage({ type: 'error', text: 'Usuário não encontrado.' });
    }
  };

  const removeFriend = (friendName: string) => {
    if (!confirm(`Remover ${friendName} da lista de amigos?`)) return;

    const updatedUser = {
        ...currentUser,
        friends: currentUser.friends.filter(f => f.name !== friendName)
    };

    const dbKey = 'lom-users-db';
    const usersStr = localStorage.getItem(dbKey);
    if (usersStr) {
        const users = JSON.parse(usersStr);
        users[currentUser.username] = updatedUser;
        localStorage.setItem(dbKey, JSON.stringify(users));
    }
    updateUser(updatedUser);
  };

  return (
    <div className={`space-y-6 pb-20 animate-fadeIn ${isSidebar ? 'p-1' : ''}`}>
      {/* Header */}
      <div className={`bg-mystic-900/80 p-4 rounded-lg border border-mystic-gold/20 flex ${isSidebar ? 'flex-col items-stretch text-center' : 'flex-col md:flex-row justify-center items-center'} gap-4`}>
        <div className={`bg-black/40 px-3 py-2 rounded border border-stone-700 flex flex-col ${isSidebar ? 'items-center' : 'items-center'} w-full`}>
           <span className="text-[9px] text-stone-500 uppercase tracking-widest">Sua Identificação (Tag)</span>
           <div className="font-mono text-stone-300 flex gap-2">
             <span className="text-mystic-gold font-bold text-lg">{currentUser.tag}</span>
           </div>
        </div>
      </div>

      <div className={`grid ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-6`}>
        {/* Add Friend Form */}
        <div className={`${isSidebar ? 'col-span-1' : 'lg:col-span-5'} bg-mystic-800 p-6 rounded-lg border border-stone-800 h-fit`}>
           <h3 className="text-mystic-gold font-serif text-lg mb-4 border-b border-mystic-gold/10 pb-2">Adicionar Amigo</h3>
           <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-500 uppercase font-bold mb-1">Nome de Usuário</label>
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-mystic-900 border border-stone-700 text-stone-200 p-2 text-sm focus:border-mystic-gold outline-none rounded"
                  placeholder="Ex: Klein"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase font-bold mb-1">Tag (5 Números)</label>
                <div className="flex items-center gap-2">
                   <span className="text-stone-500 font-mono">#</span>
                   <input 
                    type="text" 
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                    className="w-full bg-mystic-900 border border-stone-700 text-stone-200 p-2 text-sm focus:border-mystic-gold outline-none rounded font-mono tracking-widest"
                    placeholder="00000"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleAddFriend}
                className="w-full bg-mystic-gold text-mystic-900 font-bold py-2 rounded hover:bg-white transition-colors text-xs uppercase tracking-widest"
              >
                Enviar Convite
              </button>

              {message && (
                <div className={`p-2 rounded text-xs text-center border ${message.type === 'success' ? 'bg-green-900/20 border-green-900 text-green-400' : 'bg-red-900/20 border-red-900 text-red-400'}`}>
                  {message.text}
                </div>
              )}
           </div>
        </div>

        {/* Friend List */}
        <div className={`${isSidebar ? 'col-span-1' : 'lg:col-span-7'} bg-mystic-800 p-6 rounded-lg border border-stone-800 min-h-[400px]`}>
           <h3 className="text-mystic-gold font-serif text-lg mb-4 border-b border-mystic-gold/10 pb-2">Lista de Amigos ({currentUser.friends.length})</h3>
           
           {currentUser.friends.length === 0 ? (
             <div className="text-center py-10 text-stone-600">
               <p className="italic">Seu círculo está vazio.</p>
               <p className="text-xs mt-2">Adicione amigos usando Nome e Tag.</p>
             </div>
           ) : (
             <div className={`grid ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-3`}>
                {currentUser.friends.map((friend, idx) => (
                  <div key={idx} className="bg-mystic-900 border border-stone-800 p-3 rounded flex justify-between items-center group hover:border-mystic-gold/30 transition-colors">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 font-serif font-bold shrink-0">
                           {friend.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-stone-200 font-bold text-sm truncate">{friend.name}</span>
                          <span className="block text-stone-600 font-mono text-xs">#{friend.tag}</span>
                        </div>
                     </div>
                     <button 
                       onClick={() => removeFriend(friend.name)}
                       className="text-stone-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                       title="Remover Amigo"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Social;

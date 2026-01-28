
import React, { useState, useEffect } from 'react';
import { Character, Item, UserProfile } from './types';
import { INITIAL_CHARACTER } from './constants';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import AuthScreen from './components/AuthScreen';
import Skills from './components/Skills';
import Origins from './components/Origins';
import Items from './components/Items';
import World from './components/World';
import Rituals from './components/Rituals';
import Talents from './components/Talents';
import Personal from './components/Personal';
import Campaign from './components/Campaign';
import Profile from './components/Profile';
import Guide from './components/Guide';
import Pathways from './components/Pathways';

const App: React.FC = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sheet' | 'campanha' | 'pessoal' | 'pericias' | 'origens' | 'itens' | 'talentos' | 'rituais' | 'mundo' | 'guia' | 'caminhos' | 'settings' | 'perfil'>('sheet');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load user session on start
  useEffect(() => {
    const sessionUserStr = localStorage.getItem('lom-session-user');
    if (sessionUserStr) {
       try {
         const user = JSON.parse(sessionUserStr);
         setCurrentUserProfile(user);
       } catch (e) {
         console.error("Session error", e);
       }
    }
  }, []);

  // Load all characters for this user
  useEffect(() => {
    if (currentUserProfile) {
      const storageKey = `lom-user-chars-${currentUserProfile.username}`;
      const savedChars = localStorage.getItem(storageKey);
      
      if (savedChars) {
        try {
          const parsed = JSON.parse(savedChars);
          setUserCharacters(parsed.list || []);
          setActiveCharacterId(parsed.activeId || (parsed.list?.[0]?.id || null));
        } catch (e) {
          setUserCharacters([]);
        }
      } else {
        // Migration or New User: check for old single character data
        const oldData = localStorage.getItem(`lom-character-data-${currentUserProfile.username}`);
        if (oldData) {
          try {
            const char = JSON.parse(oldData);
            if (!char.id) char.id = Date.now().toString();
            setUserCharacters([char]);
            setActiveCharacterId(char.id);
          } catch (e) {
             const firstChar = { ...INITIAL_CHARACTER, id: Date.now().toString(), name: "Novo Personagem" };
             setUserCharacters([firstChar]);
             setActiveCharacterId(firstChar.id);
          }
        } else {
          const firstChar = { ...INITIAL_CHARACTER, id: Date.now().toString(), name: "Novo Personagem" };
          setUserCharacters([firstChar]);
          setActiveCharacterId(firstChar.id);
        }
      }
    }
  }, [currentUserProfile]);

  // Save characters to localStorage whenever they change
  useEffect(() => {
    if (currentUserProfile && userCharacters.length > 0) {
      const storageKey = `lom-user-chars-${currentUserProfile.username}`;
      localStorage.setItem(storageKey, JSON.stringify({
        activeId: activeCharacterId,
        list: userCharacters
      }));
    }
  }, [userCharacters, activeCharacterId, currentUserProfile]);

  const activeCharacter = userCharacters.find(c => c.id === activeCharacterId) || userCharacters[0];

  const updateActiveCharacter = (updated: Character) => {
    setUserCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleCreateCharacter = () => {
    const newChar = { 
      ...INITIAL_CHARACTER, 
      id: Date.now().toString(), 
      name: `Personagem ${userCharacters.length + 1}` 
    };
    setUserCharacters(prev => [...prev, newChar]);
    setActiveCharacterId(newChar.id);
    setNotification("Novo registro Beyonder criado.");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteCharacter = (id: string) => {
    if (userCharacters.length <= 1) {
      alert("Você deve manter pelo menos um registro ativo.");
      return;
    }
    if (confirm("Excluir este personagem permanentemente?")) {
      const newList = userCharacters.filter(c => c.id !== id);
      setUserCharacters(newList);
      if (activeCharacterId === id) {
        setActiveCharacterId(newList[0].id);
      }
    }
  };

  const handleLogin = (user: UserProfile) => {
    localStorage.setItem('lom-session-user', JSON.stringify(user));
    setCurrentUserProfile(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('lom-session-user');
    setCurrentUserProfile(null);
    setUserCharacters([]);
    setActiveCharacterId(null);
    setActiveTab('sheet');
  };

  const updateSessionUser = (user: UserProfile) => {
    setCurrentUserProfile(user);
    localStorage.setItem('lom-session-user', JSON.stringify(user));
  };

  const handleAddItem = (itemName: string, stats: string) => {
    if (!activeCharacter) return;
    const newItem: Item = {
      id: Date.now().toString(),
      name: itemName,
      description: stats,
      isSealedArtifact: false
    };

    const newNotes = activeCharacter.notes 
      ? `${activeCharacter.notes}\n- ${itemName} (${stats})` 
      : `- ${itemName} (${stats})`;

    updateActiveCharacter({
      ...activeCharacter,
      inventory: [...(activeCharacter.inventory || []), newItem],
      notes: newNotes
    });

    setNotification(`Adicionado: ${itemName}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyCharacterData = () => {
    if (!activeCharacter) return;
    const data = JSON.stringify(activeCharacter);
    navigator.clipboard.writeText(data);
    setNotification("Dados copiados! Envie para o Mestre da Campanha.");
    setTimeout(() => setNotification(null), 3000);
  };

  const NavButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setShowMobileMenu(false); }}
      className={`px-4 py-3 font-serif tracking-wider transition-all duration-300 ${
        activeTab === id 
          ? 'text-mystic-gold border-b-2 border-mystic-gold bg-white/5' 
          : 'text-stone-500 hover:text-stone-300'
      }`}
    >
      {label}
    </button>
  );

  if (!currentUserProfile) return <AuthScreen onLogin={handleLogin} />;
  if (!activeCharacter) return <div className="min-h-screen bg-mystic-900 flex items-center justify-center text-mystic-gold font-serif">Aguardando revelação do destino...</div>;

  const isFullWidth = activeTab === 'perfil' || activeTab === 'caminhos';

  return (
    <div className="min-h-screen flex flex-col animate-fadeIn relative">
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-mystic-gold text-mystic-900 px-6 py-3 rounded-full font-serif font-bold shadow-2xl border-2 border-white/20 whitespace-nowrap">
          {notification}
        </div>
      )}

      <nav className="bg-mystic-900 border-b border-mystic-gold/20 sticky top-0 z-50 shadow-2xl overflow-x-auto">
        <div className="w-full px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 min-w-max">
            <div className="flex items-center gap-3 pr-4">
               <div className="w-8 h-8 rounded-full bg-mystic-gold/20 border border-mystic-gold flex items-center justify-center shrink-0">
                 <span className="text-mystic-gold font-serif font-bold">M</span>
               </div>
               <div className="flex flex-col">
                  <span className="font-serif text-lg text-stone-200 tracking-wide hidden sm:block whitespace-nowrap leading-none">Grimório dos Mistérios</span>
                  <span className="text-[10px] text-stone-500 font-mono hidden sm:block">CONTA: {currentUserProfile.username}</span>
               </div>
            </div>
            
            <div className="hidden lg:flex space-x-1 items-center">
              <NavButton id="sheet" label="Grimório" />
              <NavButton id="caminhos" label="Caminhos" />
              <NavButton id="pericias" label="Perícias" />
              <NavButton id="origens" label="Origens" />
              <NavButton id="itens" label="Itens" />
              <NavButton id="talentos" label="Talentos" />
              <NavButton id="rituais" label="Rituais" />
              <NavButton id="mundo" label="Mundo" />
              <NavButton id="guia" label="Guia" />
              <NavButton id="campanha" label="Campanha" />
              
              <div className="h-6 w-px bg-stone-700 mx-2"></div>
              
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-3 ml-2 hover:bg-white/5 p-1 rounded-lg transition-all group ${activeTab === 'perfil' ? 'bg-white/5 border border-mystic-gold/30' : 'border border-transparent'}`}
              >
                <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-600 overflow-hidden flex items-center justify-center">
                   {currentUserProfile.avatar ? (
                     <img src={currentUserProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-sm font-serif font-bold text-stone-500 group-hover:text-stone-300">{currentUserProfile.username[0].toUpperCase()}</span>
                   )}
                </div>
              </button>
            </div>

            <div className="lg:hidden">
               <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-stone-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
               </button>
            </div>
          </div>
        </div>
        
        {showMobileMenu && (
          <div className="lg:hidden bg-mystic-800 border-b border-mystic-gold/20">
            <div className="flex flex-col p-2">
              <NavButton id="sheet" label="Grimório" />
              <NavButton id="caminhos" label="Caminhos" />
              <NavButton id="pericias" label="Perícias" />
              <NavButton id="origens" label="Origens" />
              <NavButton id="itens" label="Itens" />
              <NavButton id="talentos" label="Talentos" />
              <NavButton id="rituais" label="Rituais" />
              <NavButton id="mundo" label="Mundo" />
              <NavButton id="guia" label="Guia" />
              <NavButton id="campanha" label="Campanha" />
              <NavButton id="perfil" label="Meu Perfil" />
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 w-full p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className={`${isFullWidth ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
            {activeTab === 'sheet' && (
              <CharacterSheet 
                character={activeCharacter} 
                updateCharacter={updateActiveCharacter} 
                allCharacters={userCharacters}
                onSelectCharacter={setActiveCharacterId}
                onCreateCharacter={handleCreateCharacter}
                onDeleteCharacter={handleDeleteCharacter}
              />
            )}
            {activeTab === 'caminhos' && <Pathways activeCharacter={activeCharacter} updateCharacter={updateActiveCharacter} />}
            {activeTab === 'campanha' && <Campaign currentUser={currentUserProfile} />}
            {activeTab === 'perfil' && <Profile currentUser={currentUserProfile} updateUser={updateSessionUser} onLogout={handleLogout} />}
            {activeTab === 'pessoal' && <Personal character={activeCharacter} updateCharacter={updateActiveCharacter} />}
            {activeTab === 'pericias' && <Skills character={activeCharacter} updateCharacter={updateActiveCharacter} />}
            {activeTab === 'origens' && <Origins character={activeCharacter} updateCharacter={updateActiveCharacter} />}
            {activeTab === 'itens' && <Items onAddItem={handleAddItem} />}
            {activeTab === 'talentos' && <Talents character={activeCharacter} updateCharacter={updateActiveCharacter} />}
            {activeTab === 'rituais' && <Rituals />}
            {activeTab === 'mundo' && <World />}
            {activeTab === 'guia' && <Guide />}
            {activeTab === 'settings' && (
              <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 space-y-6">
                <h2 className="text-xl font-serif text-mystic-gold mb-2">Configurações</h2>
                <button onClick={copyCharacterData} className="bg-mystic-gold text-mystic-900 font-bold px-4 py-2 rounded text-sm hover:bg-white transition-colors">
                    Copiar Dados do Personagem Atual (JSON)
                </button>
              </div>
            )}
          </div>
          {!isFullWidth && (
            <div className="lg:col-span-4 space-y-6 h-fit sticky top-24">
              <DiceRoller />
              <div className="bg-mystic-800 p-4 rounded-lg border border-stone-700 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="block text-[10px] text-blue-400 uppercase tracking-widest mb-1">Espiritualidade</span>
                    <span className="text-2xl font-bold text-white leading-none">{activeCharacter.stats.spirituality}</span>
                  </div>
                  <div className="text-center border-l border-stone-700">
                    <span className="block text-[10px] text-red-400 uppercase tracking-widest mb-1">Sanidade</span>
                    <span className="text-2xl font-bold text-white leading-none">{activeCharacter.stats.sanity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;


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
import Social from './components/Social';
import Profile from './components/Profile';
import Guide from './components/Guide';

const App: React.FC = () => {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [character, setCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [activeTab, setActiveTab] = useState<'sheet' | 'campanha' | 'pessoal' | 'pericias' | 'origens' | 'itens' | 'talentos' | 'rituais' | 'mundo' | 'guia' | 'settings' | 'perfil'>('sheet');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Check for session in localStorage
    const sessionUserStr = localStorage.getItem('lom-session-user');
    if (sessionUserStr) {
       try {
         const user = JSON.parse(sessionUserStr);
         setCurrentUserProfile(user);
       } catch (e) {
         // Fallback for simple string sessions from previous version
         const simpleName = localStorage.getItem('lom-session');
         if (simpleName && !sessionUserStr) {
           // Create a temp profile wrapper
           setCurrentUserProfile({ username: simpleName, tag: '00000', friends: [] });
         }
       }
    }
  }, []);

  useEffect(() => {
    if (currentUserProfile) {
      const saved = localStorage.getItem(`lom-character-data-${currentUserProfile.username}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.traits) parsed.traits = [];
          if (!parsed.skills) parsed.skills = {};
          if (!parsed.talents) parsed.talents = [];
          if (!parsed.skillLabels) parsed.skillLabels = {};
          // Ensure personal object exists for older saves
          if (!parsed.personal) parsed.personal = INITIAL_CHARACTER.personal;
          setCharacter(parsed);
        } catch (e) {
          setCharacter(INITIAL_CHARACTER);
        }
      } else {
        setCharacter({...INITIAL_CHARACTER, name: currentUserProfile.username});
      }
    }
  }, [currentUserProfile]);

  useEffect(() => {
    if (currentUserProfile) {
      localStorage.setItem(`lom-character-data-${currentUserProfile.username}`, JSON.stringify(character));
    }
  }, [character, currentUserProfile]);

  const handleLogin = (user: UserProfile) => {
    localStorage.setItem('lom-session-user', JSON.stringify(user));
    setCurrentUserProfile(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('lom-session-user');
    localStorage.removeItem('lom-session'); // clean old
    setCurrentUserProfile(null);
    setCharacter(INITIAL_CHARACTER);
    setActiveTab('sheet');
  };

  const updateSessionUser = (user: UserProfile) => {
    setCurrentUserProfile(user);
    localStorage.setItem('lom-session-user', JSON.stringify(user));
  };

  const handleAddItem = (itemName: string, stats: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: itemName,
      description: stats,
      isSealedArtifact: false
    };

    const newNotes = character.notes 
      ? `${character.notes}\n- ${itemName} (${stats})` 
      : `- ${itemName} (${stats})`;

    setCharacter({
      ...character,
      inventory: [...(character.inventory || []), newItem],
      notes: newNotes
    });

    setNotification(`Adicionado: ${itemName}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const copyCharacterData = () => {
    const data = JSON.stringify(character);
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

  const isFullWidth = activeTab === 'perfil';

  return (
    <div className="min-h-screen flex flex-col animate-fadeIn relative">
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-mystic-gold text-mystic-900 px-6 py-3 rounded-full font-serif font-bold shadow-2xl border-2 border-white/20 whitespace-nowrap">
          {notification}
        </div>
      )}

      <nav className="bg-mystic-900 border-b border-mystic-gold/20 sticky top-0 z-50 shadow-2xl">
        <div className="w-full px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-mystic-gold/20 border border-mystic-gold flex items-center justify-center shrink-0">
                 <span className="text-mystic-gold font-serif font-bold">M</span>
               </div>
               <span className="font-serif text-xl text-stone-200 tracking-wide hidden sm:block whitespace-nowrap">Grimório dos Mistérios</span>
            </div>
            
            <div className="hidden lg:flex space-x-2 items-center">
              <NavButton id="sheet" label="Grimório" />
              <NavButton id="campanha" label="Campanha" />
              <NavButton id="pessoal" label="Pessoal" />
              <NavButton id="pericias" label="Perícias" />
              <NavButton id="origens" label="Origens" />
              <NavButton id="itens" label="Itens" />
              <NavButton id="talentos" label="Talentos" />
              <NavButton id="rituais" label="Rituais" />
              <NavButton id="mundo" label="Mundo" />
              <NavButton id="guia" label="Guia" />
              <NavButton id="settings" label="Configurações" />
              <div className="h-6 w-px bg-stone-700 mx-2"></div>
              
              {/* User Profile / Perfil Button */}
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-3 ml-2 hover:bg-white/5 p-1 rounded-lg transition-all group ${activeTab === 'perfil' ? 'bg-white/5 border border-mystic-gold/30' : 'border border-transparent'}`}
              >
                <div className="flex flex-col items-end leading-none">
                  <span className="text-xs text-stone-500 font-serif group-hover:text-stone-300">Olá, <span className="text-mystic-gold">{currentUserProfile.username}</span></span>
                  <span className="text-[9px] text-stone-600 font-mono group-hover:text-stone-500">#{currentUserProfile.tag}</span>
                </div>
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
              <NavButton id="campanha" label="Campanha" />
              <NavButton id="pessoal" label="Pessoal" />
              <NavButton id="pericias" label="Perícias" />
              <NavButton id="origens" label="Origens" />
              <NavButton id="itens" label="Itens" />
              <NavButton id="talentos" label="Talentos" />
              <NavButton id="rituais" label="Rituais" />
              <NavButton id="mundo" label="Mundo" />
              <NavButton id="guia" label="Guia" />
              <NavButton id="settings" label="Configurações" />
              <div className="border-t border-stone-700 mt-2 pt-2">
                 <NavButton id="perfil" label="Meu Perfil" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 w-full p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${isFullWidth ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
            {activeTab === 'sheet' && <CharacterSheet character={character} updateCharacter={setCharacter} />}
            {activeTab === 'campanha' && <Campaign currentUser={currentUserProfile} />}
            {activeTab === 'perfil' && <Profile currentUser={currentUserProfile} updateUser={updateSessionUser} onLogout={handleLogout} />}
            {activeTab === 'pessoal' && <Personal character={character} updateCharacter={setCharacter} />}
            {activeTab === 'pericias' && <Skills character={character} updateCharacter={setCharacter} />}
            {activeTab === 'origens' && <Origins character={character} updateCharacter={setCharacter} />}
            {activeTab === 'itens' && <Items onAddItem={handleAddItem} />}
            {activeTab === 'talentos' && <Talents character={character} updateCharacter={setCharacter} />}
            {activeTab === 'rituais' && <Rituals />}
            {activeTab === 'mundo' && <World />}
            {activeTab === 'guia' && <Guide />}
            {activeTab === 'settings' && (
              <div className="bg-mystic-800 p-6 rounded-lg border border-mystic-gold/20 space-y-6">
                <div>
                  <h2 className="text-xl font-serif text-mystic-gold mb-2">Configurações</h2>
                  <p className="text-sm text-stone-500">Gerencie seus dados locais.</p>
                </div>
                
                <div className="p-4 bg-mystic-900 rounded border border-stone-800">
                  <h3 className="text-stone-300 font-bold mb-2">Entrar em Campanha</h3>
                  <p className="text-xs text-stone-500 mb-4">Para entrar em uma campanha, copie seus dados e envie para o Mestre.</p>
                  <button onClick={copyCharacterData} className="bg-mystic-gold text-mystic-900 font-bold px-4 py-2 rounded text-sm hover:bg-white transition-colors">
                    Copiar Dados do Personagem (JSON)
                  </button>
                </div>

                <div className="pt-4 border-t border-stone-700">
                   <button onClick={() => confirm("Tem certeza? Isso apagará todos os dados.") && setCharacter({...INITIAL_CHARACTER, name: currentUserProfile.username || ''})} className="bg-red-900/50 hover:bg-red-900 border border-red-900 text-red-200 px-4 py-2 rounded text-xs">
                     Resetar Personagem
                   </button>
                </div>
              </div>
            )}
          </div>
          {!isFullWidth && (
            <div className="lg:col-span-4 space-y-6">
              <DiceRoller />
              <div className="bg-mystic-800 p-4 rounded-lg border border-stone-700">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="block text-xs text-blue-400">Espiritualidade</span><span className="text-xl font-bold text-white">{character.stats.spirituality}</span></div>
                  <div><span className="block text-xs text-red-400">Sanidade</span><span className="text-xl font-bold text-white">{character.stats.sanity}</span></div>
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

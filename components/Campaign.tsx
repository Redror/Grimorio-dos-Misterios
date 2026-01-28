
import React, { useState, useEffect } from 'react';
import { Character, UserProfile, PersonalInfo } from '../types';

interface SessionLog {
  id: string;
  title: string;
  date: string;
  content: string;
  clearance: 'Level 1' | 'Level 2' | 'Level 3' | 'Top Secret';
}

interface EntityDossier {
  id: string;
  name: string;
  type: 'NPC' | 'Ameaça' | 'Local' | 'Artefato';
  status: 'Ativo' | 'Desaparecido' | 'Neutralizado' | 'Aliado' | 'Falecido';
  description: string;
  threatLevel?: number; // 0-9
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: 'Em Progresso' | 'Concluída' | 'Hiato';
  gamemaster: string;
  sessions: SessionLog[];
  dossiers: EntityDossier[];
  party: Character[]; 
  evidence: string;
  createdAt: string;
}

interface CampaignProps {
  currentUser: UserProfile;
}

const Campaign: React.FC<CampaignProps> = ({ currentUser }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [view, setView] = useState<'reports' | 'dossiers' | 'evidence' | 'party'>('reports');
  const [isCreating, setIsCreating] = useState(false);
  
  // Form States
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  // Sub-Form States
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogContent, setNewLogContent] = useState('');
  
  const [isAddingEntity, setIsAddingEntity] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState<EntityDossier['type']>('NPC');
  const [newEntityDesc, setNewEntityDesc] = useState('');

  // GM Mode States
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [jsonFallback, setJsonFallback] = useState('');
  const [inspectingPlayer, setInspectingPlayer] = useState<Character | null>(null);
  const [inspectionTab, setInspectionTab] = useState<'resumo' | 'grimorio' | 'pessoal' | 'inventario'>('resumo');

  useEffect(() => {
    const saved = localStorage.getItem('lom-campaigns-data');
    if (saved) {
      setCampaigns(JSON.parse(saved));
    }
  }, []);

  const saveCampaigns = (updated: Campaign[]) => {
    setCampaigns(updated);
    localStorage.setItem('lom-campaigns-data', JSON.stringify(updated));
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
  
  // Check if current user is the GM of the active campaign
  const isGM = activeCampaign ? activeCampaign.gamemaster === currentUser.username : false;

  // Filter campaigns visible to the current user (Created by them OR Invited to)
  const visibleCampaigns = campaigns.filter(c => 
    c.gamemaster === currentUser.username || 
    (c.party && c.party.some(p => p.name === currentUser.username))
  );

  const handleCreateCampaign = () => {
    if (!newCampaignTitle) return;
    const newCamp: Campaign = {
      id: Date.now().toString(),
      title: newCampaignTitle,
      description: newCampaignDesc,
      gamemaster: currentUser.username, // Automatically set creator as GM
      status: 'Em Progresso',
      sessions: [],
      dossiers: [],
      party: [],
      evidence: '',
      createdAt: new Date().toLocaleDateString()
    };
    saveCampaigns([...campaigns, newCamp]);
    setNewCampaignTitle('');
    setNewCampaignDesc('');
    setIsCreating(false);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm("ATENÇÃO: A exclusão deste arquivo é permanente. Confirmar protocolo de deleção?")) {
      saveCampaigns(campaigns.filter(c => c.id !== id));
      if (activeCampaignId === id) setActiveCampaignId(null);
    }
  };

  const handleLeaveCampaign = (campaignId: string) => {
    if (confirm("Deseja abandonar esta expedição?")) {
      const targetCamp = campaigns.find(c => c.id === campaignId);
      if (!targetCamp) return;

      const updatedParty = (targetCamp.party || []).filter(p => p.name !== currentUser.username);
      const updatedList = campaigns.map(c => c.id === campaignId ? { ...c, party: updatedParty } : c);
      saveCampaigns(updatedList);
      if (activeCampaignId === campaignId) setActiveCampaignId(null);
    }
  };

  const handleAddLog = () => {
    if (!activeCampaign || !newLogTitle) return;
    const newLog: SessionLog = {
      id: Date.now().toString(),
      title: newLogTitle,
      date: new Date().toLocaleDateString(),
      content: newLogContent,
      clearance: 'Level 2'
    };
    const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, sessions: [newLog, ...c.sessions] } : c);
    saveCampaigns(updated);
    setNewLogTitle('');
    setNewLogContent('');
    setIsAddingLog(false);
  };

  const handleAddEntity = () => {
    if (!activeCampaign || !newEntityName) return;
    const newEntity: EntityDossier = {
      id: Date.now().toString(),
      name: newEntityName,
      type: newEntityType,
      status: 'Ativo',
      description: newEntityDesc,
      threatLevel: 0
    };
    const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, dossiers: [...c.dossiers, newEntity] } : c);
    saveCampaigns(updated);
    setNewEntityName('');
    setNewEntityDesc('');
    setIsAddingEntity(false);
  };

  const updateEntityStatus = (entityId: string, status: EntityDossier['status']) => {
    if (!activeCampaign) return;
    const updatedDossiers = activeCampaign.dossiers.map(d => d.id === entityId ? { ...d, status } : d);
    const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, dossiers: updatedDossiers } : c);
    saveCampaigns(updated);
  };

  const updateEvidence = (text: string) => {
    if (!activeCampaign) return;
    const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, evidence: text } : c);
    saveCampaigns(updated);
  };

  const executeInvite = (targetName: string) => {
    if (!activeCampaign) return;

    const storageKey = `lom-character-data-${targetName}`;
    const localData = localStorage.getItem(storageKey);
    let charToAdd: Character | null = null;
    
    if (localData) {
      try {
        charToAdd = JSON.parse(localData);
      } catch (e) {
        console.error("Dados corrompidos");
      }
    }

    if (charToAdd) {
      // Check duplicates
      if (activeCampaign.party?.some(p => p.name === charToAdd?.name)) {
        alert("Este personagem já está no grupo.");
        return;
      }
      
      const updatedParty = [...(activeCampaign.party || []), charToAdd];
      const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, party: updatedParty } : c);
      saveCampaigns(updated);
      setInviteName('');
      setJsonFallback('');
      setIsAddingPlayer(false);
      alert(`${targetName} adicionado à campanha!`);
    } else {
      alert(`Dados de personagem para "${targetName}" não encontrados neste terminal.`);
    }
  };

  const handleInvitePlayer = () => {
    // Wrapper for the manual input invite
    if (inviteName) executeInvite(inviteName);
    else if (jsonFallback) {
       // Manual JSON
       try {
        const charToAdd = JSON.parse(jsonFallback);
        if (activeCampaign && charToAdd) {
          if (activeCampaign.party?.some(p => p.name === charToAdd?.name)) {
            alert("Este personagem já está no grupo.");
            return;
          }
          const updatedParty = [...(activeCampaign.party || []), charToAdd];
          const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, party: updatedParty } : c);
          saveCampaigns(updated);
          setIsAddingPlayer(false);
        }
      } catch (e) {
        alert("JSON inválido.");
      }
    } else {
      alert("Insira um nome ou JSON.");
    }
  };

  // Syncs player data from localStorage if available
  const refreshPartyData = () => {
    if (!activeCampaign || !activeCampaign.party) return;
    
    const updatedParty = activeCampaign.party.map(char => {
      const localData = localStorage.getItem(`lom-character-data-${char.name}`);
      return localData ? JSON.parse(localData) : char;
    });

    const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, party: updatedParty } : c);
    saveCampaigns(updated);
    alert("Dados do grupo sincronizados com o armazenamento local.");
  };

  const removePlayer = (charName: string) => {
     if (!activeCampaign || !confirm(`Remover ${charName} do grupo?`)) return;
     const updatedParty = (activeCampaign.party || []).filter(p => p.name !== charName);
     const updated = campaigns.map(c => c.id === activeCampaign.id ? { ...c, party: updatedParty } : c);
     saveCampaigns(updated);
  };

  // INSPECTION MODAL CONTENT
  const renderInspectionContent = () => {
    if (!inspectingPlayer) return null;
    const c = inspectingPlayer;
    
    // SAFEGUARD: Ensure personal object exists (backward compatibility)
    const p: PersonalInfo = c.personal || {
      about: '', age: '', originCountry: '', currentCountry: '', originCity: '', currentCity: '',
      nativeLanguage: '', spokenLanguages: '', profession: '', relatives: '', friends: '',
      addendums: '', regret: '', fear: '', lossOfControl: '', improvement: '', hobby: '',
      disgust: '', pride: '', secret: '', familyAndHome: '', importantPeople: '',
      rumors: '', rumorsTruth: '', desire: '',
      soulArtifact: { name: '', abilities: '', disadvantage: '', sealingMethod: '' }
    };

    const soulArtifact = p.soulArtifact || { name: '', abilities: '', disadvantage: '', sealingMethod: '' };

    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {inspectionTab === 'resumo' && (
           <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-mystic-900 p-3 rounded border border-stone-800">
                    <h4 className="text-stone-500 uppercase text-[10px] tracking-widest mb-2">VITAIS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-stone-300"><span>Vida:</span> <span className="text-green-500">{c.stats?.hp || 0}/{c.stats?.maxHp || 0}</span></div>
                      <div className="flex justify-between text-xs text-stone-300"><span>Sanidade:</span> <span className="text-purple-500">{c.stats?.sanity || 0}/{c.stats?.maxSanity || 0}</span></div>
                      <div className="flex justify-between text-xs text-stone-300"><span>Espírito:</span> <span className="text-blue-500">{c.stats?.spirituality || 0}/{c.stats?.maxSpirituality || 0}</span></div>
                    </div>
                 </div>
                 <div className="bg-mystic-900 p-3 rounded border border-stone-800">
                    <h4 className="text-stone-500 uppercase text-[10px] tracking-widest mb-2">ATRIBUTOS</h4>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-stone-300">
                       <div>FOR: {c.attributes?.strength || 0}</div>
                       <div>AGI: {c.attributes?.agility || 0}</div>
                       <div>INT: {c.attributes?.intelligence || 0}</div>
                       <div>VIG: {c.attributes?.spirit || 0}</div>
                       <div>ESP: {c.attributes?.mysticism || 0}</div>
                       <div>PRE: {c.attributes?.presence || 0}</div>
                    </div>
                 </div>
              </div>
              
              <div className="bg-mystic-900 p-3 rounded border border-stone-800">
                 <h4 className="text-stone-500 uppercase text-[10px] tracking-widest mb-2">ARTEFATO DE ALMA</h4>
                 <p className="text-mystic-gold font-serif text-sm">{soulArtifact.name || "Nenhum manifesto."}</p>
                 <p className="text-xs text-stone-400 mt-1 italic">{soulArtifact.abilities || "Sem descrição."}</p>
              </div>
           </div>
        )}

        {inspectionTab === 'grimorio' && (
           <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="text-mystic-gold font-serif border-b border-stone-700 pb-1 mb-2">Habilidades ({(c.abilities || []).length})</h4>
                <div className="grid gap-2">
                  {(c.abilities || []).map((a, i) => (
                    <div key={i} className="bg-black/40 p-2 rounded border border-stone-800">
                      <div className="flex justify-between">
                        <span className="text-stone-200 font-bold text-xs">{a.name}</span>
                        <span className="text-[10px] text-blue-400">{a.cost}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-tight mt-1">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-mystic-gold font-serif border-b border-stone-700 pb-1 mb-2">Talentos</h4>
                <div className="flex flex-wrap gap-2">
                   {c.talents?.map((t, i) => (
                     <span key={i} className="text-[10px] bg-stone-800 px-2 py-1 rounded text-stone-300 border border-stone-700" title={t.description}>
                       {t.name}
                     </span>
                   ))}
                   {(!c.talents || c.talents.length === 0) && <span className="text-xs text-stone-500 italic">Nenhum talento.</span>}
                </div>
              </div>
           </div>
        )}

        {inspectionTab === 'pessoal' && (
           <div className="space-y-4 animate-fadeIn text-sm text-stone-300">
              {/* Sobre & Dados Básicos */}
              <div className="bg-black/40 p-3 rounded border border-stone-800 space-y-3">
                <h4 className="text-mystic-gold uppercase text-[10px] tracking-widest font-bold">Dados Básicos</h4>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Sobre</span>
                  <p className="whitespace-pre-wrap text-xs">{p.about || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-stone-500">Idade:</span> {p.age || "-"}</div>
                  <div><span className="text-stone-500">Profissão:</span> {p.profession || "-"}</div>
                </div>
                <div>
                   <span className="text-[10px] text-stone-500 uppercase block">Localização</span>
                   <p className="text-xs">Origem: {p.originCity}, {p.originCountry}</p>
                   <p className="text-xs">Atual: {p.currentCity}, {p.currentCountry}</p>
                </div>
                <div>
                   <span className="text-[10px] text-stone-500 uppercase block">Idiomas</span>
                   <p className="text-xs">Nativa: {p.nativeLanguage || "-"}</p>
                   <p className="text-xs">Faladas: {p.spokenLanguages || "-"}</p>
                </div>
              </div>

              {/* Social */}
              <div className="bg-black/40 p-3 rounded border border-stone-800 space-y-3">
                 <h4 className="text-mystic-gold uppercase text-[10px] tracking-widest font-bold">Social & Relacionamentos</h4>
                 <div>
                   <span className="text-[10px] text-stone-500 uppercase block">Parentes</span>
                   <p className="text-xs whitespace-pre-wrap">{p.relatives || "-"}</p>
                 </div>
                 <div>
                   <span className="text-[10px] text-stone-500 uppercase block">Amigos</span>
                   <p className="text-xs whitespace-pre-wrap">{p.friends || "-"}</p>
                 </div>
                 <div>
                   <span className="text-[10px] text-stone-500 uppercase block">Rumores</span>
                   <p className="text-xs italic text-stone-400">"{p.rumors || "Nenhum"}"</p>
                   <p className="text-[10px] text-stone-600 mt-1">Verdade: {p.rumorsTruth || "-"}</p>
                 </div>
              </div>

              {/* Questionário */}
              <div className="bg-black/40 p-3 rounded border border-stone-800 space-y-3">
                 <h4 className="text-mystic-gold uppercase text-[10px] tracking-widest font-bold">Questionário Pessoal</h4>
                 <div className="grid gap-3 text-xs">
                    <div><span className="text-stone-500 block">Arrependimento:</span> {p.regret || "-"}</div>
                    <div><span className="text-stone-500 block">Medo:</span> {p.fear || "-"}</div>
                    <div><span className="text-stone-500 block">Perda de Controle:</span> {p.lossOfControl || "-"}</div>
                    <div><span className="text-stone-500 block">Melhoria:</span> {p.improvement || "-"}</div>
                    <div><span className="text-stone-500 block">Hobby:</span> {p.hobby || "-"}</div>
                    <div><span className="text-stone-500 block">Desgosto:</span> {p.disgust || "-"}</div>
                    <div><span className="text-stone-500 block">Orgulho:</span> {p.pride || "-"}</div>
                    <div><span className="text-stone-500 block">Segredo:</span> {p.secret || "-"}</div>
                    <div><span className="text-stone-500 block">Família/Lar:</span> {p.familyAndHome || "-"}</div>
                    <div><span className="text-stone-500 block">Pessoas Importantes:</span> {p.importantPeople || "-"}</div>
                    <div className="border-t border-stone-800 pt-2"><span className="text-mystic-gold block font-bold">Desejo:</span> {p.desire || "-"}</div>
                 </div>
              </div>
              
              {/* Adendos */}
              {p.addendums && (
                <div className="bg-black/40 p-3 rounded border border-stone-800">
                  <h4 className="text-stone-500 uppercase text-[10px] tracking-widest mb-1">Adendos</h4>
                  <p className="whitespace-pre-wrap text-xs">{p.addendums}</p>
                </div>
              )}
           </div>
        )}

        {inspectionTab === 'inventario' && (
           <div className="space-y-4 animate-fadeIn">
              <div className="bg-black/40 p-3 rounded border border-stone-800 min-h-[200px]">
                 <pre className="whitespace-pre-wrap text-xs text-stone-300 font-serif">{c.notes}</pre>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {(c.inventory || []).map((item, i) => (
                   <div key={i} className="flex justify-between items-center bg-stone-900 p-2 rounded border border-stone-800">
                      <span className="text-xs text-stone-300">{item.name}</span>
                      {item.isSealedArtifact && <span className="text-[9px] text-red-500 border border-red-900 px-1 rounded">SELADO</span>}
                   </div>
                 ))}
                 {(!c.inventory || c.inventory.length === 0) && <p className="text-xs text-stone-500 italic">Inventário vazio.</p>}
              </div>
           </div>
        )}
      </div>
    );
  };

  if (activeCampaignId && activeCampaign) {
    // CAMPAIGN DETAIL VIEW
    return (
      <div className="space-y-6 pb-20 animate-fadeIn h-[calc(100vh-140px)] flex flex-col relative">
        
        {/* INSPECTION MODAL */}
        {inspectingPlayer && (
          <div className="absolute inset-0 z-50 bg-mystic-900/95 backdrop-blur-md flex flex-col p-4 animate-fadeIn overflow-hidden">
             <div className="flex justify-between items-start mb-4 border-b border-stone-700 pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-mystic-gold flex items-center justify-center text-mystic-900 font-bold font-serif text-xl">
                      {inspectingPlayer.name[0]}
                   </div>
                   <div>
                      <h2 className="text-xl font-serif text-white leading-none">{inspectingPlayer.name}</h2>
                      <p className="text-xs text-stone-500 uppercase">{inspectingPlayer.pathway} • Seq {inspectingPlayer.sequence}</p>
                   </div>
                </div>
                <button onClick={() => setInspectingPlayer(null)} className="text-stone-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>

             <div className="flex gap-2 mb-4 flex-shrink-0 overflow-x-auto pb-1">
                <button onClick={() => setInspectionTab('resumo')} className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded border ${inspectionTab === 'resumo' ? 'bg-mystic-gold border-mystic-gold text-mystic-900 font-bold' : 'border-stone-700 text-stone-500'}`}>Resumo</button>
                <button onClick={() => setInspectionTab('grimorio')} className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded border ${inspectionTab === 'grimorio' ? 'bg-mystic-gold border-mystic-gold text-mystic-900 font-bold' : 'border-stone-700 text-stone-500'}`}>Grimório</button>
                <button onClick={() => setInspectionTab('pessoal')} className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded border ${inspectionTab === 'pessoal' ? 'bg-mystic-gold border-mystic-gold text-mystic-900 font-bold' : 'border-stone-700 text-stone-500'}`}>Pessoal</button>
                <button onClick={() => setInspectionTab('inventario')} className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded border ${inspectionTab === 'inventario' ? 'bg-mystic-gold border-mystic-gold text-mystic-900 font-bold' : 'border-stone-700 text-stone-500'}`}>Inventário</button>
             </div>

             <div className="flex-1 bg-stone-900/50 rounded border border-stone-800 p-2 overflow-hidden flex flex-col">
                {renderInspectionContent()}
             </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-black/80 border-b border-mystic-gold/30 p-4 flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 z-20 backdrop-blur-sm gap-4">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setActiveCampaignId(null)}
               className="text-stone-500 hover:text-mystic-gold uppercase text-[10px] tracking-widest flex items-center gap-1"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               Arquivos
             </button>
             <div className="h-4 w-px bg-stone-700"></div>
             <div>
               <h2 className="text-xl font-serif text-mystic-gold leading-none">{activeCampaign.title}</h2>
               <div className="flex gap-2 text-[9px] text-stone-500 font-mono mt-1">
                 <span>GM: {activeCampaign.gamemaster}</span>
                 <span className={`uppercase font-bold ${activeCampaign.status === 'Em Progresso' ? 'text-green-500' : 'text-stone-500'}`}>{activeCampaign.status}</span>
               </div>
             </div>
           </div>
           
           <div className="flex gap-1 bg-stone-900/80 p-1 rounded border border-stone-700 self-end md:self-auto">
             <button onClick={() => setView('reports')} className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all ${view === 'reports' ? 'bg-mystic-gold text-mystic-900 font-bold' : 'text-stone-400 hover:text-white'}`}>Logs</button>
             <button onClick={() => setView('dossiers')} className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all ${view === 'dossiers' ? 'bg-mystic-gold text-mystic-900 font-bold' : 'text-stone-400 hover:text-white'}`}>NPCs</button>
             <button onClick={() => setView('party')} className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all ${view === 'party' ? 'bg-mystic-gold text-mystic-900 font-bold' : 'text-stone-400 hover:text-white'}`}>Grupo</button>
             <button onClick={() => setView('evidence')} className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all ${view === 'evidence' ? 'bg-mystic-gold text-mystic-900 font-bold' : 'text-stone-400 hover:text-white'}`}>Pistas</button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-2">
          
          {view === 'reports' && (
             /* Standard Logs */
            <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-stone-800 pb-2">
                 <h3 className="text-stone-500 font-mono text-sm uppercase">/// LOGS DE SESSÃO</h3>
                 {isGM && (
                   <button onClick={() => setIsAddingLog(!isAddingLog)} className="text-mystic-gold hover:text-white text-[10px] uppercase border border-mystic-gold/30 px-2 py-1 rounded">+ Novo Registro</button>
                 )}
               </div>
               {isAddingLog && isGM && (
                 <div className="bg-mystic-900 border-l-2 border-mystic-gold p-4 space-y-3 animate-fadeIn">
                    <input type="text" placeholder="Título" className="w-full bg-black/40 border-b border-stone-700 text-stone-200 p-2 text-sm outline-none" value={newLogTitle} onChange={(e) => setNewLogTitle(e.target.value)} />
                    <textarea placeholder="Conteúdo..." className="w-full bg-black/40 border border-stone-700 text-stone-300 p-2 text-sm outline-none h-32" value={newLogContent} onChange={(e) => setNewLogContent(e.target.value)} />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsAddingLog(false)} className="text-stone-500 text-xs px-3 py-1">Cancelar</button>
                      <button onClick={handleAddLog} className="bg-mystic-gold text-mystic-900 text-xs font-bold px-3 py-1 rounded">Arquivar</button>
                    </div>
                 </div>
               )}
               <div className="space-y-4">
                 {activeCampaign.sessions.map((session) => (
                     <div key={session.id} className="bg-mystic-800 border border-stone-800 p-0 overflow-hidden group">
                        <div className="bg-stone-900/50 p-2 border-b border-stone-800 flex justify-between items-center">
                          <div className="flex items-center gap-3"><span className="text-[9px] font-mono text-mystic-gold border border-mystic-gold/20 px-1">{session.date}</span><span className="text-stone-300 font-bold text-sm">{session.title}</span></div>
                          <span className="text-[9px] text-red-900 font-black uppercase tracking-widest">{session.clearance}</span>
                        </div>
                        <div className="p-4 text-sm text-stone-400 font-serif whitespace-pre-wrap">{session.content}</div>
                     </div>
                 ))}
               </div>
            </div>
          )}

          {/* PARTY VIEW (GM MODE / PLAYERS) */}
          {view === 'party' && (
            <div className="space-y-6">
              <div className="bg-mystic-800/50 p-4 rounded border border-mystic-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                   <h3 className="text-mystic-gold font-serif text-lg">Mesa do {isGM ? 'Mestre' : 'Grupo'}</h3>
                   <p className="text-xs text-stone-500">{isGM ? 'Convide jogadores e acesse suas fichas.' : 'Membros da expedição.'}</p>
                </div>
                {isGM && (
                  <div className="flex gap-2">
                    <button 
                       onClick={refreshPartyData}
                       className="bg-stone-800 text-stone-300 px-3 py-2 rounded text-xs border border-stone-700 hover:text-white transition-colors flex items-center gap-2"
                       title="Recarregar fichas atualizadas"
                     >
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                       Sincronizar
                     </button>
                    <button 
                       onClick={() => setIsAddingPlayer(!isAddingPlayer)} 
                       className="bg-mystic-gold text-mystic-900 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                     >
                       + Convidar Jogador
                     </button>
                  </div>
                )}
              </div>

              {isAddingPlayer && isGM && (
                 <div className="bg-mystic-900 border border-mystic-gold p-4 rounded shadow-2xl animate-fadeIn space-y-4">
                    {/* FRIEND LIST SELECTION */}
                    <div className="space-y-2">
                      <label className="text-xs text-mystic-gold uppercase font-bold">Convide um Amigo</label>
                      {currentUser.friends.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                           {currentUser.friends.map((friend, idx) => (
                             <button 
                               key={idx}
                               onClick={() => executeInvite(friend.name)}
                               className="flex justify-between items-center bg-stone-800 hover:bg-mystic-800 border border-stone-700 p-2 rounded text-left group transition-colors"
                             >
                                <span className="text-sm text-stone-300 font-bold group-hover:text-mystic-gold">{friend.name}</span>
                                <span className="text-xs text-stone-600">#{friend.tag}</span>
                             </button>
                           ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-500 italic">Sua lista de amigos está vazia. Adicione amigos na aba Social.</p>
                      )}
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-stone-800"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-600 text-[10px] uppercase">OU MANUALMENTE</span>
                        <div className="flex-grow border-t border-stone-800"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                          placeholder="Nome do Usuário (Mesmo Dispositivo)"
                          className="flex-1 bg-black border border-stone-700 text-stone-200 p-2 text-sm focus:border-mystic-gold outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <textarea 
                        value={jsonFallback}
                        onChange={(e) => setJsonFallback(e.target.value)}
                        placeholder='Cole JSON do personagem (Se for de outro dispositivo)...'
                        className="w-full h-16 bg-black border border-stone-700 text-stone-300 p-2 text-xs font-mono focus:border-mystic-gold outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                       <button onClick={() => setIsAddingPlayer(false)} className="text-stone-500 text-xs px-3 py-1">Cancelar</button>
                       <button onClick={handleInvitePlayer} className="bg-mystic-gold text-mystic-900 text-xs font-bold px-4 py-2 rounded hover:bg-white">Adicionar</button>
                    </div>
                 </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {(!activeCampaign.party || activeCampaign.party.length === 0) ? (
                   <p className="col-span-full text-center text-stone-600 italic py-10">A mesa está vazia.</p>
                 ) : (
                   activeCampaign.party.map((char, idx) => (
                     <div key={idx} className="bg-mystic-900 border border-stone-800 rounded-lg overflow-hidden relative shadow-lg group">
                        {/* Token Header */}
                        <div className="bg-stone-900 p-3 flex justify-between items-center border-b border-stone-800">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-mystic-gold/10 border border-mystic-gold text-mystic-gold flex items-center justify-center font-serif font-bold text-lg">
                                {char.pathway ? char.pathway[0] : "?"}
                              </div>
                              <div>
                                <h4 className="text-stone-200 font-bold leading-none">{char.name}</h4>
                                <span className="text-[10px] text-stone-500 uppercase">{char.pathway} • Seq {char.sequence}</span>
                              </div>
                           </div>
                           {isGM && (
                             <button onClick={() => removePlayer(char.name)} className="text-stone-600 hover:text-red-500">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                           )}
                        </div>
                        {/* Vital Bars */}
                        <div className="p-3 grid grid-cols-3 gap-2 bg-black/20">
                           <div className="text-center">
                             <div className="text-[9px] text-green-500 uppercase font-bold mb-1">Vida</div>
                             <div className="bg-stone-800 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-green-600 h-full" style={{width: `${(char.stats?.hp / char.stats?.maxHp) * 100 || 0}%`}}></div>
                             </div>
                             <span className="text-[9px] text-stone-400">{char.stats?.hp || 0}/{char.stats?.maxHp || 0}</span>
                           </div>
                           <div className="text-center">
                             <div className="text-[9px] text-blue-400 uppercase font-bold mb-1">Espírito</div>
                             <div className="bg-stone-800 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-blue-500 h-full" style={{width: `${(char.stats?.spirituality / char.stats?.maxSpirituality) * 100 || 0}%`}}></div>
                             </div>
                             <span className="text-[9px] text-stone-400">{char.stats?.spirituality || 0}/{char.stats?.maxSpirituality || 0}</span>
                           </div>
                           <div className="text-center">
                             <div className="text-[9px] text-purple-400 uppercase font-bold mb-1">Sanidade</div>
                             <div className="bg-stone-800 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-purple-500 h-full" style={{width: `${(char.stats?.sanity / char.stats?.maxSanity) * 100 || 0}%`}}></div>
                             </div>
                             <span className="text-[9px] text-stone-400">{char.stats?.sanity || 0}/{char.stats?.maxSanity || 0}</span>
                           </div>
                        </div>
                        {/* Actions / Details */}
                        {isGM && (
                          <div className="p-3">
                             <button 
                               onClick={() => setInspectingPlayer(char)}
                               className="w-full text-[10px] bg-stone-800 hover:bg-mystic-gold hover:text-mystic-900 text-stone-300 py-2 rounded border border-stone-700 transition-colors uppercase font-bold tracking-widest"
                             >
                               Inspecionar Dossiê
                             </button>
                          </div>
                        )}
                     </div>
                   ))
                 )}
              </div>
            </div>
          )}
          
          {/* DOSSIERS VIEW (Simplified render here as logic is same) */}
          {view === 'dossiers' && (
             <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-stone-800 pb-2">
                   <h3 className="text-stone-500 font-mono text-sm uppercase">/// BANCO DE DADOS</h3>
                   {isGM && (
                     <button onClick={() => setIsAddingEntity(!isAddingEntity)} className="text-mystic-gold text-[10px] uppercase border border-mystic-gold/30 px-2 py-1 rounded">+ Nova Entrada</button>
                   )}
                </div>
                {isAddingEntity && isGM && (
                   <div className="bg-mystic-900 border-l-2 border-mystic-gold p-4 space-y-3 animate-fadeIn mb-6">
                      <input type="text" placeholder="Nome" className="w-full bg-black/40 border-b border-stone-700 text-stone-200 p-2 text-sm outline-none" value={newEntityName} onChange={(e) => setNewEntityName(e.target.value)} />
                      <textarea placeholder="Descrição..." className="w-full bg-black/40 border border-stone-700 text-stone-300 p-2 text-sm outline-none h-24" value={newEntityDesc} onChange={(e) => setNewEntityDesc(e.target.value)} />
                      <button onClick={handleAddEntity} className="bg-mystic-gold text-mystic-900 text-xs font-bold px-3 py-1 rounded">Registrar</button>
                   </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {activeCampaign.dossiers.map(entity => (
                      <div key={entity.id} className="bg-mystic-800 border-l-4 border-stone-700 p-4 relative group">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="text-stone-200 font-bold font-serif text-lg">{entity.name}</h4>
                            <span className="text-[9px] font-mono border px-1 border-stone-600 text-stone-500">{entity.status}</span>
                         </div>
                         <p className="text-xs text-stone-400 italic leading-snug">{entity.description}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {view === 'evidence' && (
             <div className="h-full flex flex-col space-y-4">
                <div className="flex justify-between items-end border-b border-stone-800 pb-2"><h3 className="text-stone-500 font-mono text-sm uppercase">/// PISTAS</h3></div>
                <div className="flex-1 bg-mystic-900/50 border border-stone-800 p-4 rounded-lg relative overflow-hidden">
                   <textarea 
                     className="w-full h-full bg-transparent text-stone-300 font-mono text-sm focus:outline-none resize-none" 
                     placeholder={isGM ? "Evidências..." : "Aguardando atualizações do Mestre..."}
                     value={activeCampaign.evidence} 
                     onChange={(e) => isGM && updateEvidence(e.target.value)}
                     readOnly={!isGM}
                   />
                </div>
             </div>
          )}
        </div>
      </div>
    );
  }

  // CAMPAIGN LIST VIEW
  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-mystic-gold mb-1">Arquivos de Campanha</h2>
          <p className="text-stone-500 text-sm font-mono tracking-tight">SYSTEM_ACCESS: GRANTED // PROTOCOL: TABLETOP</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-mystic-gold/10 hover:bg-mystic-gold hover:text-mystic-900 text-mystic-gold border border-mystic-gold/40 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all"
        >
          + Iniciar Novo Protocolo
        </button>
      </div>

      {isCreating && (
        <div className="bg-mystic-800 border border-mystic-gold/30 p-6 rounded-lg shadow-2xl animate-fadeIn relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-mystic-gold"></div>
           <h3 className="text-mystic-gold font-mono text-sm uppercase mb-4">/// Inicializando Nova Campanha</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <input type="text" placeholder="Nome" className="bg-mystic-900 border border-stone-700 text-stone-200 p-3 rounded text-sm outline-none" value={newCampaignTitle} onChange={(e) => setNewCampaignTitle(e.target.value)} />
             {/* Removed GM Input - Mandatory Current User */}
             <div className="bg-mystic-900 border border-stone-700 text-stone-500 p-3 rounded text-sm italic cursor-not-allowed">GM: {currentUser.username} (Você)</div>
             <textarea placeholder="Sinopse..." className="col-span-1 md:col-span-2 bg-mystic-900 border border-stone-700 text-stone-300 p-3 rounded text-sm outline-none h-24 resize-none" value={newCampaignDesc} onChange={(e) => setNewCampaignDesc(e.target.value)} />
           </div>
           <div className="flex justify-end gap-3">
             <button onClick={() => setIsCreating(false)} className="text-stone-500 hover:text-white text-xs uppercase font-bold px-4 py-2">Abortar</button>
             <button onClick={handleCreateCampaign} className="bg-mystic-gold text-mystic-900 hover:bg-white text-xs uppercase font-bold px-6 py-2 rounded shadow-[0_0_15px_rgba(197,160,89,0.3)]">Confirmar</button>
           </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCampaigns.length === 0 && !isCreating ? (
          <div className="col-span-full text-center py-20 opacity-50">
             <div className="text-6xl text-stone-700 mb-4 font-serif">∅</div>
             <p className="text-stone-500 font-mono text-sm">Nenhum arquivo encontrado no servidor local.</p>
          </div>
        ) : (
          visibleCampaigns.map(camp => (
            <div 
              key={camp.id} 
              onClick={() => setActiveCampaignId(camp.id)}
              className="bg-mystic-800 border border-stone-800 hover:border-mystic-gold/50 rounded-lg p-0 overflow-hidden cursor-pointer group transition-all hover:transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-64"
            >
               <div className="bg-stone-900 border-b border-stone-800 p-3 flex justify-between items-center group-hover:bg-mystic-900 transition-colors">
                  <span className="text-[10px] font-mono text-stone-500 uppercase">{camp.createdAt}</span>
                  <div className="flex gap-2"><span className={`w-2 h-2 rounded-full ${camp.status === 'Em Progresso' ? 'bg-green-500 animate-pulse' : 'bg-stone-600'}`}></span></div>
               </div>
               <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif text-stone-200 group-hover:text-mystic-gold transition-colors mb-2 line-clamp-1">{camp.title}</h3>
                  <div className="text-[10px] font-mono text-stone-500 mb-4 uppercase tracking-wider">GM: {camp.gamemaster}</div>
                  <p className="text-xs text-stone-400 italic leading-relaxed line-clamp-3 mb-4 flex-1">{camp.description}</p>
                  <div className="flex justify-between items-end border-t border-stone-800 pt-3 mt-auto">
                     <span className="text-[9px] text-stone-600 font-mono">LOGS: {camp.sessions.length} | GRUPO: {camp.party ? camp.party.length : 0}</span>
                     {camp.gamemaster === currentUser.username ? (
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(camp.id); }} className="text-stone-700 hover:text-red-500 text-[10px] uppercase font-bold z-10 p-1">Deletar</button>
                     ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleLeaveCampaign(camp.id); }} className="text-stone-700 hover:text-stone-400 text-[10px] uppercase font-bold z-10 p-1">Sair</button>
                     )}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Campaign;


import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';

const World: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'mapas' | 'nacoes' | 'religioes' | 'idiomas' | 'locais'>('mapas');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  // Estado para os mapas carregados pelo usuário (Upload Local)
  const [customWorldMap, setCustomWorldMap] = useState<string | null>(null);
  const [customNorthMap, setCustomNorthMap] = useState<string | null>(null);

  // States for loading errors and generation
  const [worldMapError, setWorldMapError] = useState(false);
  const [northMapError, setNorthMapError] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // 'world' or 'north' or null

  // Carregar mapas do localStorage ao iniciar
  useEffect(() => {
    const savedWorld = localStorage.getItem('lom-custom-world-map');
    const savedNorth = localStorage.getItem('lom-custom-north-map');
    if (savedWorld) {
      setCustomWorldMap(savedWorld);
      setWorldMapError(false);
    }
    if (savedNorth) {
      setCustomNorthMap(savedNorth);
      setNorthMapError(false);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'world' | 'north') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'world') {
          setCustomWorldMap(base64);
          localStorage.setItem('lom-custom-world-map', base64);
          setWorldMapError(false);
        } else {
          setCustomNorthMap(base64);
          localStorage.setItem('lom-custom-north-map', base64);
          setNorthMapError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateMap = async (type: 'world' | 'north') => {
    setIsGenerating(type);
    const prompt = type === 'world' 
      ? "A high quality, detailed fantasy world map of 'Lord of Mysteries' universe. Victorian style cartography, parchment paper texture. Showing Northern and Southern continents separated by a vast ocean."
      : "A high quality, detailed political map of the Northern Continent from 'Lord of Mysteries' (Loen Kingdom, Intis Republic, Feysac Empire, Feynapotter). Victorian map style, parchment texture.";
    
    try {
      const base64Image = await generateImage(prompt);
      if (base64Image) {
        if (type === 'world') {
          setCustomWorldMap(base64Image);
          localStorage.setItem('lom-custom-world-map', base64Image);
          setWorldMapError(false);
        } else {
          setCustomNorthMap(base64Image);
          localStorage.setItem('lom-custom-north-map', base64Image);
          setNorthMapError(false);
        }
      }
    } catch (e) {
      console.error("Failed to generate map", e);
    } finally {
      setIsGenerating(null);
    }
  };

  const SectionButton = ({ id, label }: { id: typeof activeSection, label: string }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`px-4 py-2 rounded text-[10px] font-serif uppercase tracking-widest transition-all ${
        activeSection === id 
          ? 'bg-mystic-gold text-mystic-900 font-bold shadow-[0_0_10px_rgba(197,160,89,0.4)]' 
          : 'bg-mystic-800 text-stone-500 hover:text-stone-300 border border-stone-700'
      }`}
    >
      {label}
    </button>
  );

  // URLs com Proxy (weserv.nl)
  const MAP_WORLD_DEFAULT = "https://images.weserv.nl/?url=static.wikia.nocookie.net/lord-of-the-mysteries/images/b/bc/The_Planet_World_Map.jpg&w=1000&il";
  const MAP_NORTH_DEFAULT = "https://images.weserv.nl/?url=static.wikia.nocookie.net/lord-of-the-mysteries/images/7/7b/Northern_Continent_Detailed_Map.png&w=1000&il";

  const renderMapPlaceholder = (type: 'world' | 'north', uploadHandler: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <div className="p-10 text-center space-y-6 flex flex-col items-center justify-center h-full bg-mystic-900/80 absolute inset-0 z-10">
      <div className="space-y-2">
        <p className="text-stone-500 italic">O nevoeiro espiritual bloqueia a visão remota...</p>
        <p className="text-[10px] text-red-400 uppercase tracking-widest">Imagem indisponível</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="cursor-pointer bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded border border-stone-600 text-xs transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Carregar Arquivo Local
          <input type="file" className="hidden" accept="image/*" onChange={uploadHandler} />
        </label>
        
        <button 
          onClick={() => handleGenerateMap(type)}
          disabled={isGenerating === type}
          className="bg-mystic-gold/10 hover:bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/30 px-4 py-2 rounded text-xs transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating === type ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Gerando Mapa...
            </>
          ) : (
             <>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               Gerar Mapa com IA
             </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-fadeIn relative">
      {/* Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setEnlargedImage(null)}
        >
          <img 
            src={enlargedImage} 
            alt="Mapa Ampliado" 
            className="max-w-full max-h-full object-contain shadow-2xl border-4 border-mystic-gold/20"
          />
          <button className="absolute top-6 right-6 text-white bg-mystic-gold/20 p-2 rounded-full hover:bg-mystic-gold hover:text-mystic-900 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-mystic-900/80 p-6 rounded-lg border border-mystic-gold/20">
        <h2 className="text-2xl font-serif text-mystic-gold mb-2">Crônicas do Mundo</h2>
        <p className="text-stone-500 text-sm italic">"Onde a história termina, o mistério começa."</p>
        
        <div className="flex flex-wrap gap-2 mt-6 border-t border-stone-800 pt-4">
          <SectionButton id="mapas" label="Cartografia" />
          <SectionButton id="nacoes" label="Nações" />
          <SectionButton id="religioes" label="Religiões" />
          <SectionButton id="idiomas" label="Idiomas" />
          <SectionButton id="locais" label="Tigen" />
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeSection === 'mapas' && (
          <div className="space-y-8 animate-fadeIn">
            {/* World Map Section */}
            <div className="bg-mystic-800 p-4 rounded-lg border border-stone-800 relative group">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-mystic-gold font-serif flex items-center gap-2">
                    <span className="w-1 h-4 bg-mystic-gold"></span> Mapa Mundi
                  </h3>
                  <div className="flex gap-2">
                    <label className="text-[10px] cursor-pointer flex items-center gap-1 text-stone-400 hover:text-white border border-stone-600 hover:border-mystic-gold px-3 py-1 rounded transition-all bg-stone-900">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Carregar Imagem
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'world')} />
                    </label>
                    <button 
                      onClick={() => setEnlargedImage(customWorldMap || MAP_WORLD_DEFAULT)}
                      disabled={worldMapError && !customWorldMap}
                      className="text-[10px] text-mystic-gold hover:bg-mystic-gold hover:text-mystic-900 border border-mystic-gold/30 px-3 py-1 rounded transition-all disabled:opacity-50"
                    >
                      Ampliar
                    </button>
                  </div>
               </div>
               
               <div className="rounded overflow-hidden border border-mystic-gold/10 relative min-h-[300px] bg-mystic-900 flex items-center justify-center">
                 {/* Image */}
                 <img 
                   src={customWorldMap || MAP_WORLD_DEFAULT} 
                   alt="Mapa Mundi" 
                   referrerPolicy="no-referrer"
                   className={`w-full h-auto transition-all duration-700 block ${(!worldMapError || customWorldMap) ? 'hover:scale-105 cursor-zoom-in' : 'opacity-0'}`}
                   loading="eager"
                   onClick={() => (!worldMapError || customWorldMap) && setEnlargedImage(customWorldMap || MAP_WORLD_DEFAULT)}
                   onError={() => setWorldMapError(true)}
                   style={{ display: (worldMapError && !customWorldMap) ? 'none' : 'block' }}
                 />

                 {/* Error / Placeholder State */}
                 {(worldMapError && !customWorldMap) && renderMapPlaceholder('world', (e) => handleImageUpload(e, 'world'))}
               </div>
               <p className="text-[10px] text-stone-500 mt-2 text-center italic">Continente Ocidental, Norte, Sul e Terra Esquecida dos Deuses.</p>
            </div>
          </div>
        )}

        {activeSection === 'nacoes' && (
          <div className="space-y-6 animate-fadeIn">
            {/* North Map embedded in Nations section */}
            <div className="bg-mystic-800 p-4 rounded-lg border border-stone-800 relative group">
               <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-serif text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-mystic-gold"></span> Mapa Político (Norte)
                  </h3>
                  <div className="flex gap-2">
                    <label className="text-[9px] cursor-pointer flex items-center gap-1 text-stone-500 hover:text-white border border-stone-700 hover:border-mystic-gold px-2 py-0.5 rounded transition-all bg-stone-900">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Alterar Mapa
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'north')} />
                    </label>
                    <button 
                      onClick={() => setEnlargedImage(customNorthMap || MAP_NORTH_DEFAULT)}
                      disabled={northMapError && !customNorthMap}
                      className="text-[9px] text-mystic-gold hover:text-white border border-mystic-gold/30 px-2 py-0.5 rounded disabled:opacity-50"
                    >
                      Ampliar
                    </button>
                  </div>
               </div>
               <div className="h-64 rounded overflow-hidden border border-mystic-gold/10 relative bg-black/40">
                 <img 
                   src={customNorthMap || MAP_NORTH_DEFAULT} 
                   alt="Continente Norte" 
                   referrerPolicy="no-referrer"
                   className={`w-full h-full object-cover object-top transition-transform duration-700 ${(!northMapError || customNorthMap) ? 'hover:scale-105 cursor-zoom-in' : 'opacity-0'}`}
                   onClick={() => (!northMapError || customNorthMap) && setEnlargedImage(customNorthMap || MAP_NORTH_DEFAULT)}
                   onError={() => setNorthMapError(true)}
                   style={{ display: (northMapError && !customNorthMap) ? 'none' : 'block' }}
                 />
                 
                 {(northMapError && !customNorthMap) && renderMapPlaceholder('north', (e) => handleImageUpload(e, 'north'))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-mystic-gold font-serif border-b border-mystic-gold/20 pb-2">Continente Norte</h3>
                <NationCard 
                  name="Reino de Loen" 
                  capital="Backlund" 
                  ruler="Rei Jevi Augustus I" 
                  currency="Libra de Ouro (20 Soli / 240 Pence)" 
                  desc="Uma das três superpotências. Segue o padrão da Inglaterra industrial. Genética de porte médio, tons claros. Cultura de elegância e delicadeza."
                  religions="Noite Eterna, Tempestades, Vapor e Maquinaria, Mãe Terra"
                  language="Loen"
                />
                <NationCard 
                  name="República de Intis" 
                  capital="Trier" 
                  ruler="Conselho Republicano" 
                  currency="Chifres de Ouro / Verl d'Or (5 Chifres = 1 Libra)" 
                  desc="Fundada pela família Sauron, transformada por Roselle Gustav. Povo de pele parda a morena, cabelos crespos/ondulados. Honestos e diretos, vistos como rudes."
                  religions="Vapor e Maquinaria, Eterno Sol Ardente"
                  language="Intis"
                />
                <NationCard 
                  name="Império Feysac" 
                  capital="St. Millom" 
                  ruler="Casa do Chifre Prateado" 
                  currency="Chifres de Ouro / Feypratas (5 Feypratas = 1 Libra)" 
                  desc="Guerreiros. Povo nativo muito alto (1,80~2,20m). Ganharam a Ilha de Sônia em guerra contra Loen."
                  religions="Deus do Combate"
                  language="Feysac"
                />
                <NationCard 
                  name="Reino de Feynapotter" 
                  capital="Feynapotter City" 
                  ruler="Família Castiya" 
                  currency="Chifres de Ouro / Feypratas (5 Feypratas = 1 Libra)" 
                  desc="Porto seguro para refugiados religiosos. Perdeu força com as independências de Lenburgo, Masin e Segar. População variada."
                  religions="Corte à Mãe Terra"
                  language="Feysac"
                />
                <NationCard 
                  name="Lenburgo" 
                  capital="Desconhecida" 
                  ruler="Independente" 
                  currency="Libras e Chifres de Ouro" 
                  desc="Pequeno país independente. Local do principal quartel da Igreja do Conhecimento."
                  religions="Igreja do Conhecimento"
                  language="Loen e Feysac"
                />
                <NationCard 
                  name="Masin & Segar" 
                  capital="Variada" 
                  ruler="Independente" 
                  currency="Libras" 
                  desc="Pequenos países independentes de Feynapotter."
                  religions="Igreja do Conhecimento"
                  language="Feysac"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-mystic-gold font-serif border-b border-mystic-gold/20 pb-2">Continente Sul</h3>
                <div className="bg-mystic-800 p-4 rounded border border-stone-800">
                  <h4 className="text-white font-serif mb-2">Visão Geral</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">Vegetação de cerrados, desertos e florestas tropicais. Local de muitos confrontos.</p>
                </div>
                <div className="bg-mystic-800 p-4 rounded border border-stone-800">
                  <h4 className="text-white font-serif mb-2">Balam Leste</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">Majoritariamente tribal. Colônias de Loen e Feysac em disputa. Presença de cultos xamânicos à morte.</p>
                </div>
                <div className="bg-mystic-800 p-4 rounded border border-stone-800">
                  <h4 className="text-white font-serif mb-2">Balam Oeste</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">Caótico. Tradição de mercantilizar escravos. Cultos de sacrifícios e rituais sangrentos. Colônias de Intis e Loen.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'religioes' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-mystic-gold font-serif text-lg mb-4 border-b border-mystic-gold/20 pb-2">Sete Deuses Ortodoxos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReligionCard name="Deus do Combate" color="red" desc="Agracia fiéis com força. A vida começa no campo de batalha. Honra suprema ao morrer em combate." />
                <ReligionCard name="Mãe Terra" color="green" desc="A natureza como vida única. Violência é desnecessária. Todos voltarão à terra." />
                <ReligionCard name="Noite Eterna" color="purple" desc="Representa desastre, calmaria, azar e descanso eterno. Ideais de igualdade de gênero e classe." />
                <ReligionCard name="Vapor e Maquinaria" color="orange" desc="Precursores da engenharia e tecnologia. Guia do Artesanato e Protetor da Humanidade." />
                <ReligionCard name="Sol Eterno" color="yellow" desc="Personificação Sacra. Luta contra o mal e a morte. Expurgam o oculto e a corrupção mundana." />
                <ReligionCard name="Lorde das Tempestades" color="blue" desc="Marinheiros e piratas. Agracia com força e vigor. Crentes são fortes fisicamente e emocionalmente." />
                <ReligionCard name="Deus da Sabedoria" color="indigo" desc="Busca a iluminação da mente. Valoriza o saber. O conhecimento perdura após a morte." />
                <ReligionCard name="O Tolo" color="gold" desc="O Rei de Amarelo e Preto. Troca equivalente e proteção contra loucura. Acolhe desesperados. Mensageiros ligados ao Tarô." />
              </div>
            </div>

            <div>
              <h3 className="text-red-900 font-serif text-lg mb-4 border-b border-red-900/20 pb-2">Seitas e Não Ortodoxos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded border border-red-900/20">
                  <h4 className="text-red-500 font-serif mb-1 uppercase tracking-widest text-xs">Culto a Morte</h4>
                  <p className="text-[10px] text-stone-500">Cultuam o Imperador do Submundo. Aspectos xamânicos, desejam reviver a divindade e o Império Balam.</p>
                </div>
                <div className="bg-black/40 p-4 rounded border border-red-900/20">
                  <h4 className="text-red-500 font-serif mb-1 uppercase tracking-widest text-xs">Escola Filosófica da Vida</h4>
                  <p className="text-[10px] text-stone-500">Cultistas da lua. O universo dividido em Racional, Espiritual e Material. Adeptos da astrologia.</p>
                </div>
                <div className="bg-black/40 p-4 rounded border border-red-900/20">
                  <h4 className="text-red-500 font-serif mb-1 uppercase tracking-widest text-xs">Escola Filosófica Rubra</h4>
                  <p className="text-[10px] text-stone-500">Pregam a liberdade dos desejos carnais. O Deus Acorrentado contra a inibição e máscaras sociais.</p>
                </div>
                <div className="bg-black/40 p-4 rounded border border-red-900/20">
                  <h4 className="text-red-500 font-serif mb-1 uppercase tracking-widest text-xs">Cruz de Ferro e Sangue</h4>
                  <p className="text-[10px] text-stone-500">Acreditam no Verdadeiro Criador traído pelos sete deuses. Exploram o sobrenatural bruto.</p>
                </div>
                 <div className="bg-black/40 p-4 rounded border border-red-900/20">
                  <h4 className="text-blue-500 font-serif mb-1 uppercase tracking-widest text-xs">Deus do Mar</h4>
                  <p className="text-[10px] text-stone-500">Culto pouco conhecido, originário de marinheiros de uma ilha distante.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'idiomas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <div className="bg-mystic-800 p-6 rounded-lg border border-stone-800 space-y-4 shadow-xl">
              <h3 className="text-mystic-gold font-serif text-lg border-b border-stone-700 pb-2">Línguas Modernas</h3>
              <LanguageItem name="Loen" desc="Língua comum de Loen e Feynapotter." />
              <LanguageItem name="Intis" desc="Língua comum de Intis." />
              <LanguageItem name="Feysec" desc="Língua comum de Feysac." />
              <LanguageItem name="Dutanense" desc="Idioma nativo do Continente Sul (Balam Leste/Oeste)." />
              <LanguageItem name="Montanhês" desc="Língua original e ancestral do Continente Sul." />
            </div>
            <div className="bg-mystic-900/40 p-6 rounded-lg border border-mystic-gold/10 space-y-4 shadow-inner">
              <h3 className="text-mystic-gold font-serif text-lg flex items-center gap-2 border-b border-mystic-gold/10 pb-2">
                <span className="text-mystic-corruption">★</span> Línguas Místicas & Antigas
              </h3>
              <LanguageItem name="Feysec Antigo" desc="Derivado do Jotuun. Origem dos idiomas do norte. Nobres de Loen aprendem cedo." />
              <LanguageItem name="Hermes" desc="Idioma místico refinado, usado em feitiços e encantos." />
              <LanguageItem name="Hermes Antigo" desc="Bruto, alta afinidade mística, mas carece de defesa contra o mundo espiritual." />
              <LanguageItem name="Jotuun (Gigantes)" desc="Língua dos gigantes. Feitiços com efeitos místicos no corpo físico." />
              <LanguageItem name="Élfico" desc="Língua dos antigos elfos. Feitiços relacionados às forças da natureza." />
              <LanguageItem name="Draconense" desc="Língua dos dragões. Feitiços relacionados ao domínio mental." />
            </div>
          </div>
        )}

        {activeSection === 'locais' && (
          <div className="animate-fadeIn max-w-3xl mx-auto bg-mystic-800 p-8 rounded-lg border border-stone-700 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl text-mystic-gold pointer-events-none">T</div>
             <h3 className="text-3xl font-serif text-white mb-6 border-b border-mystic-gold/30 pb-4">Tigen: A Encruzilhada</h3>
             <div className="space-y-4 text-stone-400 text-sm leading-relaxed">
               <p>Cidade comercial média no centro de Loen, cruzamento dos rios <span className="text-mystic-gold">Tussoc</span> e <span className="text-mystic-gold">Khoy</span>.</p>
               <p>Não é extremamente desenvolvida, mas conecta várias cidades à capital Backlund. População mistura miséria extrema, operários industriais, pequenos comerciantes e nobres médios.</p>
               <p>Clima ameno na maior parte do ano, levemente frio no inverno e brisa agradável no verão.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                 <div className="p-4 bg-mystic-900 rounded border border-stone-800 shadow-lg">
                   <h4 className="text-mystic-gold text-xs font-bold uppercase mb-2">A Toca do Vira-Lata</h4>
                   <p className="text-[11px] text-stone-500 italic">Bar sujo ideal para afogar mágoas com álcool, tabaco e apostas.</p>
                 </div>
                 <div className="p-4 bg-mystic-900 rounded border border-stone-800 shadow-lg">
                   <h4 className="text-mystic-gold text-xs font-bold uppercase mb-2">Universidade Roccan</h4>
                   <p className="text-[11px] text-stone-500 italic">Ponto movimentado. Onde famílias comuns sonham em alcançar status de nobreza.</p>
                 </div>
               </div>
               
               <div className="mt-4 text-center">
                 <span className="text-[10px] text-stone-600 uppercase tracking-widest">Presença Religiosa</span>
                 <p className="text-xs text-stone-400">Pequenas igrejas da Noite Eterna e das Tempestades.</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NationCard = ({ name, capital, ruler, currency, desc, religions, language }: { name: string, capital: string, ruler: string, currency: string, desc: string, religions: string, language: string }) => (
  <div className="bg-mystic-800 p-4 rounded border border-stone-800 hover:border-mystic-gold/20 transition-all shadow-md group">
    <h4 className="text-white font-serif text-lg mb-1 group-hover:text-mystic-gold transition-colors">{name}</h4>
    <div className="grid grid-cols-2 gap-2 text-[9px] uppercase text-stone-500 font-bold mb-3">
      <div><span className="text-stone-700">Capital:</span> {capital}</div>
      <div><span className="text-stone-700">Líder:</span> {ruler}</div>
      <div className="col-span-2 text-mystic-gold"><span className="text-stone-700">Moeda:</span> {currency}</div>
      <div className="col-span-2"><span className="text-stone-700">Fés:</span> {religions}</div>
      <div className="col-span-2"><span className="text-stone-700">Língua:</span> {language}</div>
    </div>
    <p className="text-xs text-stone-400 leading-snug">{desc}</p>
  </div>
);

const ReligionCard = ({ name, color, desc }: { name: string, color: string, desc: string }) => {
  const colors: Record<string, string> = {
    purple: 'border-purple-900/50 bg-purple-900/5 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
    blue: 'border-blue-900/50 bg-blue-900/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    orange: 'border-orange-900/50 bg-orange-900/5 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
    yellow: 'border-yellow-900/50 bg-yellow-900/5 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]',
    red: 'border-red-900/50 bg-red-900/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    green: 'border-green-900/50 bg-green-900/5 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    indigo: 'border-indigo-900/50 bg-indigo-900/5 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
    gold: 'border-mystic-gold/50 bg-mystic-gold/5 text-mystic-gold shadow-[0_0_15px_rgba(197,160,89,0.1)]'
  };

  return (
    <div className={`p-4 rounded border transition-all hover:scale-105 ${colors[color] || ''}`}>
      <h4 className="font-serif font-bold text-sm mb-2 text-white">{name}</h4>
      <p className="text-[10px] leading-relaxed opacity-80">{desc}</p>
    </div>
  );
};

const LanguageItem = ({ name, desc }: { name: string, desc: string }) => (
  <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded transition-colors group">
    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-mystic-gold shrink-0 group-hover:shadow-[0_0_8px_rgba(197,160,89,1)] transition-all"></div>
    <div>
      <h5 className="text-xs font-bold text-stone-200">{name}</h5>
      <p className="text-[10px] text-stone-500 leading-snug">{desc}</p>
    </div>
  </div>
);

export default World;

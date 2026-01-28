
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const generateTag = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Simulate backend with localStorage using a new DB key for structured data
    const dbKey = 'lom-users-db';
    const usersStr = localStorage.getItem(dbKey);
    let users: Record<string, UserProfile> = usersStr ? JSON.parse(usersStr) : {};

    // Backward compatibility for old simple string storage
    // If we find users in 'lom-users' (old key), we ignore them or ask to recreate to get a tag
    
    if (isRegistering) {
      if (users[username]) {
        setError('Este nome de usuário já está em uso.');
        return;
      }

      const newTag = generateTag();
      const newUser: UserProfile = {
        username,
        password,
        tag: newTag,
        friends: []
      };

      users[username] = newUser;
      localStorage.setItem(dbKey, JSON.stringify(users));
      
      // Also set session
      onLogin(newUser);
    } else {
      const user = users[username];
      if (user && user.password === password) {
        onLogin(user);
      } else {
        // Fallback for old accounts (optional, but good for UX)
        const oldUsersStr = localStorage.getItem('lom-users');
        const oldUsers = oldUsersStr ? JSON.parse(oldUsersStr) : {};
        if (oldUsers[username] === password) {
          // Migrate old user to new format
          const migratedUser: UserProfile = {
             username,
             password,
             tag: generateTag(),
             friends: []
          };
          users[username] = migratedUser;
          localStorage.setItem(dbKey, JSON.stringify(users));
          onLogin(migratedUser);
        } else {
          setError('Usuário ou senha incorretos.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mystic-900 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-mystic-gold rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-mystic-crimson rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full bg-mystic-800 border border-mystic-gold/30 p-8 rounded-lg shadow-2xl relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-mystic-gold/10 border border-mystic-gold flex items-center justify-center mx-auto mb-4">
             <span className="text-mystic-gold font-serif font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-serif text-mystic-gold mb-2">Grimório dos Mistérios</h1>
          <p className="text-stone-500 text-sm">Entre no nevoeiro da história.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-serif text-stone-400 uppercase tracking-widest mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-mystic-900 border border-stone-700 text-stone-200 rounded p-3 focus:border-mystic-gold outline-none transition-colors"
              placeholder="Seu nome de Beyonder"
            />
          </div>

          <div>
            <label className="block text-xs font-serif text-stone-400 uppercase tracking-widest mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-mystic-900 border border-stone-700 text-stone-200 rounded p-3 focus:border-mystic-gold outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {isRegistering && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-serif text-stone-400 uppercase tracking-widest mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-mystic-900 border border-stone-700 text-stone-200 rounded p-3 focus:border-mystic-gold outline-none transition-colors"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-mystic-gold mt-2 italic">* Uma Tag única de 5 dígitos será gerada para você.</p>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded border border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-mystic-gold/80 hover:bg-mystic-gold text-mystic-900 font-bold py-3 px-4 rounded transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isRegistering ? 'Inscrever-se no Destino' : 'Abrir o Grimório'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-stone-700/50 pt-4">
          <p className="text-stone-500 text-sm mb-2">
            {isRegistering ? 'Já possui um registro?' : 'Ainda não tem um registro?'}
          </p>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-mystic-gold hover:text-white text-sm font-serif underline decoration-mystic-gold/30 underline-offset-4 transition-colors"
          >
            {isRegistering ? 'Acessar conta existente' : 'Criar nova conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

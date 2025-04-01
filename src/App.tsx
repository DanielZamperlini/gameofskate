import React, { useState, useEffect } from 'react';
import { X, Keyboard as Skateboarding, Trophy, UserPlus, Trash2, Shuffle } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  letters: { letter: string; failed: boolean }[];
}

function App() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('skatePlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('skatePlayers', JSON.stringify(players));
  }, [players]);

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now(),
      name: newPlayerName,
      letters: 'SKATE'.split('').map(letter => ({ letter, failed: false }))
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const toggleLetter = (playerId: number, letterIndex: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newLetters = [...player.letters];
        newLetters[letterIndex] = {
          ...newLetters[letterIndex],
          failed: !newLetters[letterIndex].failed
        };
        return { ...player, letters: newLetters };
      }
      return player;
    }));
  };

  const deletePlayer = (playerId: number) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const isPlayerOut = (player: Player) => {
    return player.letters.every(letter => letter.failed);
  };

  const shufflePlayers = async () => {
    if (players.length < 2 || isShuffling) return;
    
    setIsShuffling(true);
    
    // Animate shuffling multiple times
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setPlayers(prevPlayers => {
        const shuffled = [...prevPlayers];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
      setShuffleCount(prev => prev + 1);
    }

    // Final shuffle after delay
    setTimeout(() => {
      setPlayers(prevPlayers => {
        const finalShuffle = [...prevPlayers];
        for (let i = finalShuffle.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalShuffle[i], finalShuffle[j]] = [finalShuffle[j], finalShuffle[i]];
        }
        return finalShuffle;
      });
      setIsShuffling(false);
    }, 4000);
  };

  return (
    <div 
      className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("./controlegame.png")',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-white">
            GAME OF SKATE
          </h1>
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <div className="mb-6 sm:mb-8 flex justify-start flex-wrap gap-2 sm:gap-4">
          <form onSubmit={addPlayer} className="flex flex-1 gap-2 sm:gap-4">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nome do skatista"
              className="text-xl px-2 py-1 rounded-lg border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5" />
              <span>OK</span>
            </button>
          </form>
          
          <button
            onClick={shufflePlayers}
            disabled={isShuffling || players.length < 2}
            className={`px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200
              ${isShuffling 
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : players.length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? 'Sorteando...' : 'Sortear Ordem'}</span>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`bg-white/90 text-3xl backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 ${
                isPlayerOut(player) ? 'bg-red-50/90' : ''
              } transform transition-all duration-200 ${
                isShuffling ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'
              }`}
            >
              <div className="flex items-center justify-between sm:flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600">#{index + 1}</span>
                  <span className="font-semibold px-1 text-3xl">{player.name}</span>
                  {isPlayerOut(player) && (
                    <span className="text-red-500 font-semibold text-3xl sm:text-base">
                      Eliminado!
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors sm:hidden"
                  title="Deletar jogador"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 sm:gap-3">
                  {player.letters.map((letterObj, letterIndex) => (
                    <button
                      key={letterIndex}
                      onClick={() => toggleLetter(player.id, letterIndex)}
                      className={`w-12 h-12 flex items-center justify-center rounded border-2 text-3xl sm:text-base
                        ${letterObj.failed 
                          ? 'border-red-500 bg-red-50 text-red-500' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                    >
                      {letterObj.failed ? (
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        letterObj.letter
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="hidden sm:block p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Deletar jogador"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
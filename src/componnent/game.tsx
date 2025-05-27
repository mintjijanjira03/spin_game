import React, { useEffect, useState } from 'react';
import "../SlotMachine.css"; // อย่าลืมให้ไฟล์นี้อยู่ในโปรเจกต์

const symbols = ['🍒', '🍋', '🍉', '🍊', '🍇', '🥬', '🥦', '🌽', '🥒', '🍆'];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const Reel: React.FC<{ spinning: boolean; stopAt: string }> = ({ spinning, stopAt }) => {
  const [current, setCurrent] = useState(getRandomSymbol());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (spinning) {
      interval = setInterval(() => {
        setCurrent(getRandomSymbol());
      }, 100);
    } else {
      setCurrent(stopAt);
    }
    return () => clearInterval(interval);
  }, [spinning, stopAt]);

  return <div className="reel">{current}</div>;
};

const BurstEffect: React.FC = () => {
  const bursts = Array.from({ length: 12 }, (_, i) => {
    const angle = (360 / 12) * i;
    const x = Math.cos((angle * Math.PI) / 180) * 100 + 'px';
    const y = Math.sin((angle * Math.PI) / 180) * 100 + 'px';
    return (
      <div
        key={i}
        className="burst-circle"
        style={{ '--x': x, '--y': y } as React.CSSProperties}
      />
    );
  });

  return <div className="burst-effect">{bursts}</div>;
};

const SlotMachine: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [stoppingSymbols, setStoppingSymbols] = useState(['', '', '']);
  const [win, setWin] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  const spinSound = new Audio('/spin_sound.mp3');
  const winSound = new Audio('/win_sound.mp3');

  const spin = () => {
    setSpinning(true);
    setWin(false);
    setShowEffect(false);
    spinSound.play();

    let finalSymbols: string[];
    const chanceToWin = 0.4;

    if (Math.random() < chanceToWin) {
      const winningSymbol = getRandomSymbol();
      finalSymbols = [winningSymbol, winningSymbol, winningSymbol];
    } else {
      finalSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    }

    setStoppingSymbols(['', '', '']);

    setTimeout(() => setStoppingSymbols([finalSymbols[0], '', '']), 1000);
    setTimeout(() => setStoppingSymbols([finalSymbols[0], finalSymbols[1], '']), 1800);
    setTimeout(() => {
      setStoppingSymbols(finalSymbols);
      setSpinning(false);

      if (finalSymbols.every((s) => s === finalSymbols[0])) {
        setWin(true);
        setShowEffect(true);
        winSound.play();
        setTimeout(() => setShowEffect(false), 1000);
      }
    }, 2600);
  };

  return (
    <div className="slot-machine-container">
      <h2>🧸 Happy Spin Land 🧸</h2>
      {showEffect && <BurstEffect />}
      <div className="reels-container">
        {[0, 1, 2].map((i) => (
          <Reel key={i} spinning={spinning && !stoppingSymbols[i]} stopAt={stoppingSymbols[i]} />
        ))}
      </div>
      <button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && <h1 style={{ fontSize: '40px' }} className="win-message">🎉 You Win! 🎉</h1>}
    </div>
  );
};

export default SlotMachine;

// Modo claro / oscuro. El tema inicial lo aplica un script en index.html para evitar parpadeos.
import { useEffect, useState } from 'react';

export function useTema() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
  }, [oscuro]);

  const alternar = () => {
    const siguiente = !oscuro;
    try {
      localStorage.setItem('tema', siguiente ? 'oscuro' : 'claro');
    } catch {
      // Sin acceso a localStorage (modo privado): el tema solo dura esta visita.
    }
    setOscuro(siguiente);
  };

  return { oscuro, alternar };
}

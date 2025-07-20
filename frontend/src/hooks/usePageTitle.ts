import { useEffect } from 'react';

export const usePageTitle = (title: string, append = true) => {
  useEffect(() => {
    const baseTitle = "Mesa Virtual";
    const fullTitle = append ? `${title} | ${baseTitle}` : title;
    
    document.title = fullTitle;
    
    // Cleanup: restaurar título base cuando el componente se desmonte
    return () => {
      document.title = `${baseTitle} - Tu plataforma de rol de mesa`;
    };
  }, [title, append]);
};

'use client';

import styles from './page.module.css';

interface ExportButtonProps {
  deck: {
    id: string;
    title: string;
    topic: string;
    cards: any[];
  };
}

export function ExportButton({ deck }: ExportButtonProps) {
  const handleExport = () => {
    const dataStr = JSON.stringify(deck, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deck.title.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className={styles.actionButton} onClick={handleExport}>
      📥 Export
    </button>
  );
}

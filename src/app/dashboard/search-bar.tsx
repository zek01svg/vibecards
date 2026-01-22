'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    const params = new URLSearchParams(searchParams.toString());
    if (filter !== 'all') {
      params.set('filter', filter);
    } else {
      params.delete('filter');
    }
    router.replace(`/dashboard?${filter !== 'all' ? params.toString() : ''}`, { scroll: false });
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search decks..."
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => handleFilter('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'recent' ? styles.active : ''}`}
          onClick={() => handleFilter('recent')}
        >
          Recent
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'large' ? styles.active : ''}`}
          onClick={() => handleFilter('large')}
        >
          Large
        </button>
      </div>
    </div>
  );
}

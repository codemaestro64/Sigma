'use client';

interface TokenFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function TokenFilters({ filter, onFilterChange }: TokenFiltersProps) {
  return (
    <div>
      {/* Your filter UI components */}
    </div>
  );
}


import React from 'react';

export interface SKUItem {
  id: string;
  code: string;
  spuCode: string;
  nameZh: string;
  nameEn: string;
  availableStock: number;
  imageUrl?: string;
}

export interface SPUItem {
  id: string;
  spuCode: string;
  nameZh: string;
  nameEn: string;
  imageUrl?: string;
  skuCount: number;
}

export type FilterMode = 'include' | 'exclude' | 'empty' | 'not_empty';

export interface BaseFilterProps<T> {
  items: T[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  label: string;
  placeholder?: string;
  maxTagCount?: number;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  renderTag: (item: T, onDelete: () => void, handleHover: (item: T | null) => void) => React.ReactNode;
  renderListItem: (item: T, isSelected: boolean, searchQuery: string, handleHover: (item: T | null) => void) => React.ReactNode;
  renderPreview: (item: T, side: 'left' | 'right', isOpen: boolean) => React.ReactNode;
}

export interface SKUFilterProps extends Omit<BaseFilterProps<SKUItem>, 'items' | 'loading' | 'onSearch' | 'onLoadMore' | 'hasMore' | 'renderTag' | 'renderListItem' | 'renderPreview'> {
  showStock?: boolean;
  showSpu?: boolean;
  showImage?: boolean;
}

export interface SPUFilterProps extends Omit<BaseFilterProps<SPUItem>, 'items' | 'loading' | 'onSearch' | 'onLoadMore' | 'hasMore' | 'renderTag' | 'renderListItem' | 'renderPreview'> {
  showImage?: boolean;
  showSkuCount?: boolean;
}

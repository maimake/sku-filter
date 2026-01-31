
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check, Loader2 } from 'lucide-react';
import { BaseFilterProps, FilterMode } from '../types';

export const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded-sm font-bold">{part}</span>
        ) : (
          part
        )
      ))}
    </>
  );
};

const MODE_OPTIONS: { value: FilterMode; label: string; color: string; textColor: string }[] = [
  { value: 'include', label: '包含', color: 'bg-blue-50 border-blue-100', textColor: 'text-blue-700' },
  { value: 'exclude', label: '不包含', color: 'bg-red-50 border-red-100', textColor: 'text-red-700' },
  { value: 'empty', label: '为空', color: 'bg-gray-50 border-gray-100', textColor: 'text-gray-700' },
  { value: 'not_empty', label: '不为空', color: 'bg-green-50 border-green-100', textColor: 'text-green-700' },
];

export function BaseFilter<T extends { id: string }>({
  items,
  selectedIds,
  onChange,
  filterMode,
  onFilterModeChange,
  label,
  placeholder,
  maxTagCount = 3,
  loading = false,
  onSearch,
  onLoadMore,
  hasMore = false,
  renderTag,
  renderListItem,
  renderPreview,
}: BaseFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isExpandedVisible, setIsExpandedVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<T | null>(null);
  const [previewSide, setPreviewSide] = useState<'left' | 'right'>('left');
  const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, T>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const currentModeOption = MODE_OPTIONS.find(opt => opt.value === filterMode) || MODE_OPTIONS[0];
  const isValueDisabled = filterMode === 'empty' || filterMode === 'not_empty';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsExpandedVisible(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) {
        setIsModeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => dropdownInputRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    setSelectedItemsCache(prev => {
      const next = { ...prev };
      let changed = false;
      items.forEach(item => {
        if (selectedIds.includes(item.id) && JSON.stringify(next[item.id]) !== JSON.stringify(item)) {
          next[item.id] = item;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [items, selectedIds]);

  useEffect(() => {
    if (onSearch) {
      if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = window.setTimeout(() => onSearch(searchQuery), 300);
    }
    return () => { if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery, onSearch]);

  const handleItemHover = (item: T | null) => {
    if (item && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;
      setPreviewSide(spaceLeft > spaceRight ? 'left' : 'right');
    }
    setHoveredItem(item);
  };

  const selectedItemsDisplay = useMemo(() => {
    return selectedIds.map(id => items.find(i => i.id === id) || selectedItemsCache[id]).filter(Boolean) as T[];
  }, [items, selectedIds, selectedItemsCache]);

  const visibleSelected = selectedItemsDisplay.slice(0, maxTagCount);
  const hiddenCount = selectedIds.length - visibleSelected.length;
  const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));

  return (
    <div className="relative w-full" ref={containerRef}>
      {hoveredItem && renderPreview(hoveredItem, previewSide, isOpen)}

      <div 
        className={`group relative flex items-stretch min-h-[32px] bg-white border rounded transition-all ${isOpen ? 'ring-1 ring-blue-500 border-blue-500 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
        onMouseLeave={() => setIsExpandedVisible(false)}
      >
        {isExpandedVisible && selectedIds.length > 0 && (
          <div className="absolute top-full left-0 w-full pt-1 z-[300]">
            <div className="bg-white border border-blue-500 rounded shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-150 origin-top">
              <div className="bg-blue-50/40 px-2 py-1.5 border-b border-blue-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label} - 已选 ({selectedIds.length})</span>
                <X size={12} className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setIsExpandedVisible(false)} />
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1.5 flex flex-wrap gap-1.5 custom-scrollbar bg-white">
                {selectedItemsDisplay.map(item => renderTag(item, () => onChange(selectedIds.filter(id => id !== item.id)), handleItemHover))}
              </div>
            </div>
          </div>
        )}

        <div className="relative flex-shrink-0" ref={modeMenuRef}>
          <button onClick={() => { setIsModeMenuOpen(!isModeMenuOpen); setIsOpen(false); }} className={`flex items-center gap-0.5 h-full px-1.5 text-[11px] font-bold transition-colors border-r rounded-l-[inherit] ${currentModeOption.color} ${currentModeOption.textColor}`}>
            {currentModeOption.label} <ChevronDown size={10} />
          </button>
          {isModeMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {MODE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { onFilterModeChange(opt.value); setIsModeMenuOpen(false); if (opt.value.includes('empty')) onChange([]); }} className={`w-full px-3 py-1.5 text-left text-[11px] font-medium hover:bg-gray-50 flex items-center justify-between ${filterMode === opt.value ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}>
                  {opt.label} {filterMode === opt.value && <Check size={10} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`relative flex-1 flex flex-wrap items-center gap-1 p-1 cursor-pointer ${isValueDisabled ? 'bg-gray-50/50 cursor-not-allowed' : ''}`} onClick={() => !isValueDisabled && setIsOpen(!isOpen)}>
          <div className="absolute -top-2 left-1.5 bg-white px-1 text-[9px] font-bold text-blue-600 uppercase tracking-wider z-30 pointer-events-none">{label}</div>
          {selectedIds.length === 0 ? <span className="text-xs text-gray-400 px-1">{isValueDisabled ? currentModeOption.label : placeholder}</span> : (
            <>
              {visibleSelected.map(item => renderTag(item, () => onChange(selectedIds.filter(id => id !== item.id)), handleItemHover))}
              {hiddenCount > 0 && <span onMouseEnter={() => setIsExpandedVisible(true)} className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors cursor-help">+{hiddenCount}</span>}
            </>
          )}
        </div>

        <div className="flex items-center px-1.5 border-l border-gray-50 bg-gray-50/30 rounded-r-[inherit]">
          {isOpen ? <Search size={14} className="text-blue-600 animate-in fade-in zoom-in duration-200" /> : <ChevronDown size={14} className="text-gray-300" />}
        </div>
      </div>

      {isOpen && !isValueDisabled && (
        <div className="absolute z-[200] w-[300px] left-0 mt-1 bg-white border border-gray-200 rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 origin-top-left">
          <div className="p-2 border-b border-gray-100 bg-gray-50/50 flex items-center relative">
            <Search className="absolute left-4 text-gray-400" size={14} />
            <input ref={dropdownInputRef} type="text" className="w-full pl-8 pr-8 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="搜索关键词..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <X size={12} className="absolute right-4 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSearchQuery('')} />}
          </div>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar" onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop <= clientHeight + 50 && onLoadMore && hasMore && !loading) onLoadMore();
          }}>
            <div className="flex items-center px-3 py-2 border-b border-gray-50 sticky top-0 bg-white z-10 text-xs">
              <div className={`flex items-center gap-2 flex-1 ${!searchQuery.trim() || loading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}`} onClick={() => {
                if (!searchQuery.trim() || loading) return;
                const allIds = items.map(i => i.id);
                onChange(isAllSelected ? selectedIds.filter(id => !allIds.includes(id)) : Array.from(new Set([...selectedIds, ...allIds])));
              }}>
                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${isAllSelected && searchQuery.trim() ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 group-hover:border-blue-400'}`}>{isAllSelected && <Check size={12} strokeWidth={3} />}</div>
                <span className="font-semibold text-gray-700">{!searchQuery.trim() ? '全选(请先搜索)' : '全选当前结果'}</span>
              </div>
              {selectedIds.length > 0 && <div className="flex items-center gap-1.5 ml-auto text-[9px] font-bold uppercase tracking-wider"><span className="text-gray-400">已选: {selectedIds.length}</span><button onClick={() => onChange([])} className="text-blue-600 hover:text-blue-700">清除</button></div>}
            </div>
            <div className="divide-y divide-gray-50 min-h-[60px] relative">
              {loading && items.length === 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]"><Loader2 className="animate-spin text-blue-600" /></div>}
              {items.map(item => renderListItem(item, selectedIds.includes(item.id), searchQuery, handleItemHover))}
              {loading && items.length > 0 && <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-4 h-4 text-blue-600" /></div>}
              {!loading && items.length === 0 && <div className="p-10 text-center text-xs text-gray-400">无匹配记录</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

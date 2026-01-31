
import React, { useState, useCallback, useRef } from 'react';
import { Check } from 'lucide-react';
import { SKUFilterProps, SKUItem } from '../types';
import { BaseFilter, HighlightText } from './BaseFilter';
import { MOCK_SKUS } from '../mockData';

const PAGE_SIZE = 10;

const SKUFilter: React.FC<SKUFilterProps> = (props) => {
  const { showStock = true, showSpu = true, showImage = true } = props;
  
  const [items, setItems] = useState<SKUItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const queryRef = useRef('');
  const pageRef = useRef(1);

  const handleSearch = useCallback(async (query: string) => {
    queryRef.current = query;
    pageRef.current = 1;
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    
    const filtered = MOCK_SKUS.filter(i => 
      i.code.toLowerCase().includes(query.toLowerCase()) || 
      i.nameZh.includes(query) ||
      i.nameEn.toLowerCase().includes(query.toLowerCase())
    );
    
    setItems(filtered.slice(0, PAGE_SIZE));
    setHasMore(filtered.length > PAGE_SIZE);
    setLoading(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const nextPage = pageRef.current + 1;
    const query = queryRef.current;
    
    const filtered = MOCK_SKUS.filter(i => 
      i.code.toLowerCase().includes(query.toLowerCase()) || 
      i.nameZh.includes(query) ||
      i.nameEn.toLowerCase().includes(query.toLowerCase())
    );
    
    const start = (nextPage - 1) * PAGE_SIZE;
    const newItems = filtered.slice(start, start + PAGE_SIZE);
    
    setItems(prev => [...prev, ...newItems]);
    setHasMore(start + PAGE_SIZE < filtered.length);
    pageRef.current = nextPage;
    setLoading(false);
  }, [loading, hasMore]);

  return (
    <BaseFilter<SKUItem>
      {...props}
      items={items}
      loading={loading}
      hasMore={hasMore}
      onSearch={handleSearch}
      onLoadMore={handleLoadMore}
      renderTag={(item, onDelete, onHover) => (
        <span 
          key={item.id}
          className="flex items-center gap-1 pl-0.5 pr-0.5 py-0 text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 rounded-sm hover:bg-gray-200 shrink-0 transition-colors"
          onMouseEnter={() => onHover(item)}
          onMouseLeave={() => onHover(null)}
        >
          {showImage && (
            <div className="w-4 h-4 rounded-sm overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
              {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
            </div>
          )}
          <span className="font-bold shrink-0">{item.code}</span>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-0.5 hover:bg-gray-300 rounded-full transition-colors">×</button>
        </span>
      )}
      renderListItem={(item, isSelected, query, onHover) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
          onClick={() => props.onChange(isSelected ? props.selectedIds.filter(id => id !== item.id) : [...props.selectedIds, item.id])}
          onMouseEnter={() => onHover(item)}
          onMouseLeave={() => onHover(null)}
        >
          <div className={`w-4 h-4 flex items-center justify-center border rounded shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
          {showImage && (
            <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
              {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[9px] text-gray-300 font-bold">未上传</span>}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1 space-y-0.5 pt-0.5">
            <div className="text-[11px] font-bold text-gray-800 truncate leading-tight"><HighlightText text={item.nameZh} highlight={query} /></div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-gray-600 font-medium leading-none">
              <span className="truncate min-w-0"><HighlightText text={item.code} highlight={query} /></span>
              {showStock && <span className={`text-[9px] font-bold ${item.availableStock < 100 ? 'text-orange-500' : 'text-green-600'}`}>{item.availableStock}</span>}
            </div>
            {showSpu && <div className="text-[9px] text-gray-400 truncate pt-0.5 italic leading-none"><HighlightText text={item.spuCode} highlight={query} /></div>}
          </div>
        </div>
      )}
      renderPreview={(item, side, isOpen) => (
        <div 
          style={{ [side === 'left' ? 'right' : 'left']: isOpen ? '312px' : 'calc(100% + 12px)' }}
          className={`absolute top-0 bg-white border border-gray-200 rounded-lg shadow-2xl p-2.5 z-[400] w-[220px] animate-in fade-in zoom-in-95 duration-200 pointer-events-none transition-all origin-top-${side}`}
        >
          <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-50 border border-gray-100 mb-2.5 flex items-center justify-center">
            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" /> : <span className="text-gray-300 font-bold text-[13px] tracking-widest">未上传</span>}
          </div>
          <div className="space-y-1.5 px-0.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-bold text-gray-900 break-all leading-tight flex-1">{item.code}</p>
              {showStock && <span className={`text-[9px] font-bold ${item.availableStock === 0 ? 'text-red-500' : 'text-green-600'}`}>库存: {item.availableStock}</span>}
            </div>
            {showSpu && <p className="text-[9px] text-blue-500 font-bold uppercase mt-0.5 tracking-tight">SPU: {item.spuCode}</p>}
            <div className="pt-1.5 border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-700 leading-snug">{item.nameZh}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 italic leading-tight">{item.nameEn}</p>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default SKUFilter;

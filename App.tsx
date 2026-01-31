
import React, { useState } from 'react';
import SKUFilter from './components/SKUFilter';
import SPUFilter from './components/SPUFilter';
import { FilterMode } from './types';
import { Settings2, SlidersHorizontal, Info, Search, RotateCcw, Calendar, Filter, Terminal, Eye, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  // --- SKU Component Config States ---
  const [skuConfig, setSkuConfig] = useState({
    maxTagCount: 2,
    showStock: true,
    showSpu: true,
    showImage: true,
    label: 'SKU',
    placeholder: '选择 SKU...'
  });

  // --- SPU Component Config States ---
  const [spuConfig, setSpuConfig] = useState({
    maxTagCount: 2,
    showImage: true,
    showSkuCount: true,
    label: 'SPU',
    placeholder: '选择 SPU...'
  });

  // --- Selection States ---
  const [selectedSkuIds, setSelectedSkuIds] = useState<string[]>(['sku-1']);
  const [skuFilterMode, setSkuFilterMode] = useState<FilterMode>('include');

  const [selectedSpuIds, setSelectedSpuIds] = useState<string[]>([]);
  const [spuFilterMode, setSpuFilterMode] = useState<FilterMode>('include');

  const handleReset = () => {
    setSelectedSkuIds([]);
    setSelectedSpuIds([]);
    setSkuFilterMode('include');
    setSpuFilterMode('include');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
      {/* 1. Top Filter Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 mr-4 border-r border-gray-100 pr-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-bold text-gray-700 whitespace-nowrap">筛选条件</span>
          </div>

          {/* SPU Filter (LEFT) */}
          <div className="w-[280px]">
            <SPUFilter
              {...spuConfig}
              selectedIds={selectedSpuIds}
              onChange={setSelectedSpuIds}
              filterMode={spuFilterMode}
              onFilterModeChange={setSpuFilterMode}
            />
          </div>

          {/* SKU Filter (RIGHT) */}
          <div className="w-[280px]">
            <SKUFilter
              {...skuConfig}
              selectedIds={selectedSkuIds}
              onChange={setSelectedSkuIds}
              filterMode={skuFilterMode}
              onFilterModeChange={setSkuFilterMode}
            />
          </div>

          <div className="h-[32px] px-3 bg-gray-50 border border-gray-300 rounded flex items-center gap-2 text-gray-400 cursor-not-allowed">
            <Calendar size={14} />
            <span className="text-xs">选择日期范围</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="h-[32px] px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors">
              <Search size={14} /> 搜索
            </button>
            <button 
              onClick={handleReset}
              className="h-[32px] px-4 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-500 text-gray-600 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> 重置
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Body Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Settings2 className="text-blue-600" />
                组件实验室
              </h1>
              <p className="text-gray-500 text-sm mt-1">组件数据加载逻辑已内聚，父组件仅需管理业务状态。</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
              <Info size={16} />
              <span className="text-xs font-bold">提示：组件内部自动处理搜索、分页和缓存</span>
            </div>
          </div>

          {/* Side-by-Side Config Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SPU Config (Left) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
                  <SlidersHorizontal size={16} /> SPU 配置项
                </h3>
              </div>
              <div className="p-6 flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Label 文本</label>
                    <input type="text" value={spuConfig.label} onChange={e => setSpuConfig({...spuConfig, label: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">最大标签数</label>
                    <input type="number" min="0" value={spuConfig.maxTagCount} onChange={e => setSpuConfig({...spuConfig, maxTagCount: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">占位符 (Placeholder)</label>
                  <input type="text" value={spuConfig.placeholder} onChange={e => setSpuConfig({...spuConfig, placeholder: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div className="space-y-4 pt-2 border-t border-gray-50 mt-4">
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => setSpuConfig({...spuConfig, showImage: !spuConfig.showImage})}>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">显示图片</p>
                      <p className="text-[10px] text-gray-400">控制 SPU 维度的图片预览显示</p>
                    </div>
                    {spuConfig.showImage ? <Eye className="text-blue-500" size={18} /> : <EyeOff className="text-gray-300" size={18} />}
                  </div>
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => setSpuConfig({...spuConfig, showSkuCount: !spuConfig.showSkuCount})}>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">显示关联 SKU 数量</p>
                      <p className="text-[10px] text-gray-400">在预览和列表中展示 SKU 统计</p>
                    </div>
                    {spuConfig.showSkuCount ? <Eye className="text-blue-500" size={18} /> : <EyeOff className="text-gray-300" size={18} />}
                  </div>
                </div>
              </div>
            </div>

            {/* SKU Config (Right) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/40 flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wide">
                  <SlidersHorizontal size={16} /> SKU 配置项
                </h3>
              </div>
              <div className="p-6 flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Label 文本</label>
                    <input type="text" value={skuConfig.label} onChange={e => setSkuConfig({...skuConfig, label: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">最大标签数</label>
                    <input type="number" min="0" value={skuConfig.maxTagCount} onChange={e => setSkuConfig({...skuConfig, maxTagCount: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">占位符 (Placeholder)</label>
                  <input type="text" value={skuConfig.placeholder} onChange={e => setSkuConfig({...skuConfig, placeholder: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-50 mt-4">
                  {[
                    { id: 'showImage', label: '显示图片', desc: '在列表和标签中显示预览图' },
                    { id: 'showStock', label: '显示库存', desc: '显示 Qty 数量及库存状态' },
                    { id: 'showSpu', label: '显示关联 SPU', desc: '在 SKU 下方展示所属 SPU 编码' }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between cursor-pointer group" onClick={() => setSkuConfig({...skuConfig, [item.id]: !skuConfig[item.id as keyof typeof skuConfig]})}>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                        <p className="text-[10px] text-gray-400">{item.desc}</p>
                      </div>
                      {skuConfig[item.id as keyof typeof skuConfig] ? <Eye className="text-blue-500" size={18} /> : <EyeOff className="text-gray-300" size={18} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Debug Monitor */}
          <div className="bg-[#1e1e1e] rounded-xl shadow-2xl p-6 text-gray-300 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={14} className="text-green-500" />
                实时状态监控 (Debug Monitor)
              </h4>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600">
                <span>Components: Self-Contained</span>
                <span>Theme: Unified Blue</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SPU Monitor Output */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-400/80 bg-blue-500/10 px-2 py-1 rounded">
                  <span>SPU OUTPUT (Selected: {selectedSpuIds.length})</span>
                  <span>MODE: {spuFilterMode.toUpperCase()}</span>
                </div>
                <div className="bg-[#121212] p-4 rounded-md border border-gray-800 h-[180px] overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
                  {selectedSpuIds.length > 0 ? (
                    <pre className="text-blue-300 whitespace-pre-wrap">
                      {JSON.stringify({
                        mode: spuFilterMode,
                        count: selectedSpuIds.length,
                        ids: selectedSpuIds
                      }, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-gray-700 italic">// SPU: No selection yet</span>
                  )}
                </div>
              </div>

              {/* SKU Monitor Output */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-400/80 bg-blue-500/10 px-2 py-1 rounded">
                  <span>SKU OUTPUT (Selected: {selectedSkuIds.length})</span>
                  <span>MODE: {skuFilterMode.toUpperCase()}</span>
                </div>
                <div className="bg-[#121212] p-4 rounded-md border border-gray-800 h-[180px] overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
                  {selectedSkuIds.length > 0 ? (
                    <pre className="text-blue-300 whitespace-pre-wrap">
                      {JSON.stringify({
                        mode: skuFilterMode,
                        count: selectedSkuIds.length,
                        ids: selectedSkuIds
                      }, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-gray-700 italic">// SKU: No selection yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Advanced Filter Suite Prototype v2.5 - Lab Edition</p>
      </footer>
    </div>
  );
};

export default App;

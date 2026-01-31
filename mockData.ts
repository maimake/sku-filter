
import { SKUItem, SPUItem } from './types';

const baseItems: SKUItem[] = [
  { id: '1', code: 'SKINTIFIC-470-01', spuCode: 'SKINTIFIC-470', nameZh: '5X神经酰胺保湿霜', nameEn: '5X Ceramide Barrier Repair Moisture Gel', availableStock: 1250, imageUrl: 'https://picsum.photos/seed/sku1/40/40' },
  { id: '2', code: 'SKINTIFIC-313-01', spuCode: 'SKINTIFIC-313', nameZh: '亚马逊白泥泥膜棒', nameEn: 'Mugwort Anti Pores & Acne Clay Stick', availableStock: 450, imageUrl: 'https://picsum.photos/seed/sku2/40/40' },
  { id: '3', code: 'SKINTIFIC-426-01', spuCode: 'SKINTIFIC-426', nameZh: '5% B5神经酰胺修复面霜', nameEn: '5% Panthenol Hyaluronic Acid Moisturizer', availableStock: 89, imageUrl: undefined }, 
  { id: '4', code: 'SKINTIFIC-425-01', spuCode: 'SKINTIFIC-425', nameZh: 'B5积雪草修护啫喱', nameEn: 'B5 Centella Soothing Gel', availableStock: 0, imageUrl: 'https://picsum.photos/seed/sku4/40/40' },
  { id: '5', code: 'SKINTIFIC-463-01W', spuCode: 'SKINTIFIC-463', nameZh: 'SKINTIFIC旅行修护亮白组合', nameEn: 'Travel Repair & Brightening Set', availableStock: 2100, imageUrl: 'https://picsum.photos/seed/sku5/40/40' },
];

export const MOCK_SKUS: SKUItem[] = Array.from({ length: 50 }, (_, i) => {
  const base = baseItems[i % baseItems.length];
  return {
    ...base,
    id: `sku-${i + 1}`,
    code: `${base.code}-${i + 1}`,
    nameZh: base.nameZh
  };
});

export const MOCK_SPUS: SPUItem[] = Array.from({ length: 20 }, (_, i) => {
  const base = baseItems[i % baseItems.length];
  return {
    id: `spu-${i + 1}`,
    spuCode: `${base.spuCode}-${i + 1}`,
    nameZh: base.nameZh,
    nameEn: base.nameEn,
    imageUrl: base.imageUrl,
    skuCount: Math.floor(Math.random() * 10) + 1
  };
});

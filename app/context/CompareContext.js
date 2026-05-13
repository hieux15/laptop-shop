'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('compare');
      if (saved) setCompareList(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading compare list:', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Error saving compare list:', e);
    }
  }, [compareList, isLoaded]);

  const toggleCompare = (product) => {
    const isInList = compareList.some(item => item.id === product.id);
    
    if (isInList) {
      setCompareList(prev => prev.filter(item => item.id !== product.id));
      toast.success(`Đã xóa "${product.name}" khỏi danh sách so sánh`);
    } else {
      if (compareList.length >= 4) {
        toast.error('Chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc');
        return;
      }
      setCompareList(prev => [...prev, product]);
      toast.success(`Đã thêm "${product.name}" vào danh sách so sánh`);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(item => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
    toast.success('Đã xóa tất cả sản phẩm khỏi danh sách so sánh');
  };

  const isInCompare = (id) => compareList.some(item => item.id === id);
  const getCompareCount = () => compareList.length;

  return (
    <CompareContext.Provider value={{
      compareList, toggleCompare, removeFromCompare, clearCompare, isInCompare, getCompareCount, isLoaded
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) throw new Error('useCompare must be used within a CompareProvider');
  return context;
}
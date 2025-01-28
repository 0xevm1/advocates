"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useCallback, useMemo, useRef, useState } from "react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  phoneNumber: string;
  yearsOfExperience: string;
}

interface ClientTableProps {
  initialData: Advocate[];
}

const AdvocateRow = memo(({ advocate, index, height, start }: { 
    advocate: Advocate; 
    index: number;
    height: number;
    start: number;
  }) => (
    <div
      className="absolute top-0 left-0 w-full border-b border-slate-200 bg-white flex hover:bg-slate-50 transition-colors"
      style={{
        height: `${height}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      <div className="p-4 w-32 flex-shrink-0 font-medium text-slate-900">{advocate.firstName}</div>
      <div className="p-4 w-32 flex-shrink-0 font-medium text-slate-900">{advocate.lastName}</div>
      <div className="p-4 w-32 flex-shrink-0 text-slate-600">{advocate.city}</div>
      <div className="p-4 w-24 flex-shrink-0">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {advocate.degree}
        </span>
      </div>
      <div className="p-4 w-96 flex-shrink-0 text-slate-600">
        {advocate.specialties.map((specialty, j) => (
          <div key={j} className="py-1 text-sm">
            • {specialty}
          </div>
        ))}
      </div>
      <div className="p-4 w-32 flex-shrink-0 text-slate-600">{advocate.yearsOfExperience}</div>
      <div className="p-4 w-64 flex-shrink-0 font-mono text-sm text-slate-600">
        {advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
      </div>
    </div>
  ));
AdvocateRow.displayName = 'AdvocateRow';

export default function ClientTable({ initialData }: ClientTableProps) {
  const [advocates, setAdvocates] = useState<Advocate[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredAdvocates = useMemo(() => {
    if (!searchTerm) return advocates;
    
    return advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some(s => 
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.phoneNumber.toString().includes(searchTerm)
      );
    });
  }, [advocates, searchTerm]);

  const rowVirtualizer = useVirtualizer({
    count: filteredAdvocates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Solace Advocates</h1>
        <p className="text-slate-500">Browse and search through our network of professional advocates</p>
      </div>
      
      <div className="mb-8 bg-slate-50 p-6 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-2">Search Directory</p>
        <div className="flex gap-3">
          <input
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 placeholder-slate-400"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, city, specialty..."
          />
          <button 
            onClick={handleReset}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
          >
            Reset
          </button>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-slate-500">
            Showing results for: <span className="font-medium text-slate-700">{searchTerm}</span>
          </p>
        )}
      </div>

      <div 
        ref={parentRef} 
        className="h-[600px] overflow-auto relative border border-slate-200 rounded-xl bg-white"
      >
        <div className="sticky top-0 bg-slate-50 shadow-sm z-10 flex w-full border-b border-slate-200">
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-32 flex-shrink-0">First Name</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-32 flex-shrink-0">Last Name</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-32 flex-shrink-0">City</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-24 flex-shrink-0">Degree</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-96 flex-shrink-0">Specialties</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-32 flex-shrink-0">Experience</div>
          <div className="p-4 text-left bg-slate-50 text-sm font-semibold text-slate-900 w-32 flex-shrink-0">Contact</div>
        </div>
        
        <div className="relative">
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <AdvocateRow
              key={virtualRow.key}
              advocate={filteredAdvocates[virtualRow.index]}
              index={virtualRow.index}
              height={virtualRow.size}
              start={virtualRow.start}
            />
          ))}
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
        </div>
      </div>
    </div>
  );
}
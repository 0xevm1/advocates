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
      className="absolute top-0 left-0 w-full border-t border-gray-200 bg-white flex"
      style={{
        height: `${height}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      <div className="p-4 w-32 flex-shrink-0">{advocate.firstName}</div>
      <div className="p-4 w-32 flex-shrink-0">{advocate.lastName}</div>
      <div className="p-4 w-32 flex-shrink-0">{advocate.city}</div>
      <div className="p-4 w-24 flex-shrink-0">{advocate.degree}</div>
      <div className="p-4 w-96 flex-shrink-0">
        {advocate.specialties.map((specialty, j) => (
          <div key={j} className="py-1">{specialty}</div>
        ))}
      </div>
      <div className="p-4 w-32 flex-shrink-0">{advocate.yearsOfExperience}</div>
      <div className="p-4 w-32 flex-shrink-0">{advocate.phoneNumber}</div>
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Solace Advocates</h1>
      
      <div className="mb-6">
        <p className="mb-2">
        </p>
        <div className="flex gap-2">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search advocates..."
          />
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Reset Search
          </button>
        </div>
      </div>

      <div ref={parentRef} className="h-[600px] overflow-auto relative border border-gray-200 rounded-lg">
        <div className="sticky top-0 bg-gray-50 shadow-sm z-10 flex">
          <div className="p-4 text-left bg-gray-50 font-medium w-32 flex-shrink-0">First Name</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-32 flex-shrink-0">Last Name</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-32 flex-shrink-0">City</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-24 flex-shrink-0">Degree</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-96 flex-shrink-0">Specialties</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-32 flex-shrink-0">Years of Experience</div>
          <div className="p-4 text-left bg-gray-50 font-medium w-32 flex-shrink-0">Phone Number</div>
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
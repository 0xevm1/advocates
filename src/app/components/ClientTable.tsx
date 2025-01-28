"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useCallback, useRef, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { Loader2 } from "lucide-react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  phoneNumber: string;
  yearsOfExperience: string;
}

interface PaginatedResponse {
  advocates: Advocate[];
  total: number;
  page: number;
  pageSize: number;
}

interface ClientTableProps {
  initialData: PaginatedResponse;
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
          <div key={j} className="py-1 text-sm">• {specialty}</div>
        ))}
      </div>
      <div className="p-4 w-32 flex-shrink-0 text-slate-600">{advocate.yearsOfExperience}</div>
      <div className="p-4 w-32 flex-shrink-0 font-mono text-sm text-slate-600">
        {advocate.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
      </div>
    </div>
  ));
AdvocateRow.displayName = 'AdvocateRow';

export default function ClientTable({ initialData }: ClientTableProps) {
  const [advocates, setAdvocates] = useState<Advocate[]>(initialData.advocates);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(initialData.total);
  const [isLoading, setIsLoading] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const pageSize = 100; // Increased page size since we're virtualizing

  const rowVirtualizer = useVirtualizer({
    count: advocates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string, pageNum: number) => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `/api/advocates/search?term=${term}&page=${pageNum}&pageSize=${pageSize}`
        );
        const data: PaginatedResponse = await response.json();
        setAdvocates(data.advocates);
        setTotalItems(data.total);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm, page);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, page, debouncedSearch]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Solace Advocates</h1>
        <p className="text-slate-500">
          Browse through our network of {totalItems.toLocaleString()} professional advocates
        </p>
      </div>
      
      <div className="mb-8 bg-slate-50 p-6 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-2">Search Directory</p>
        <div className="flex gap-3">
          <input
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, city, specialty..."
          />
        </div>
      </div>

      <div 
        className="border border-slate-200 rounded-xl bg-white relative"
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

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div ref={parentRef} className="h-[600px] overflow-auto relative">
            <div className="relative w-full">
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <AdvocateRow
                  key={virtualRow.key}
                  advocate={advocates[virtualRow.index]}
                  index={virtualRow.index}
                  height={virtualRow.size}
                  start={virtualRow.start}
                />
              ))}
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems.toLocaleString()} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
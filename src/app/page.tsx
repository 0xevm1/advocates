import ClientTable from "./components/ClientTable";

async function getAdvocates(searchParams: { 
  page?: string; 
  pageSize?: string;
  term?: string;
}) {
  const baseUrl = process.env.BASE_URL 
    ? `https://${process.env.BASE_URL}`
    : 'http://localhost:3000';

  // Default to first page with 100 items if not specified
  const page = searchParams.page || '1';
  const pageSize = searchParams.pageSize || '100';
  const term = searchParams.term || '';

  const queryString = new URLSearchParams({
    page,
    pageSize,
    term
  }).toString();

  const res = await fetch(`${baseUrl}/api/advocates?${queryString}`, { 
    cache: 'no-store', // We want fresh data for searches
  });

  if (!res.ok) {
    throw new Error('Failed to fetch advocates');
  }

  return res.json();
}

export default async function Home({
  searchParams
}: {
  searchParams: { page?: string; pageSize?: string; term?: string }
}) {
  const data = await getAdvocates(searchParams);
  
  return <ClientTable initialData={data} />;
}
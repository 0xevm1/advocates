import ClientTable from "./components/ClientTable";

async function getAdvocates() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.BASE_URL}`
    : 'http://localhost:3000';
  const res = await fetch(baseUrl + '/api/advocates', { cache: 'force-cache' });
  const data = await res.json();
  return data;
}

export default async function Home() {
  const initialData = await getAdvocates();
  
  return <ClientTable initialData={initialData} />;
}

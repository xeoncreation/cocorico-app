export async function GET(){
  // Stub - reemplazar por supabase
  return new Response(JSON.stringify({ modules:[{id:"m1",slug:"fundamentos",title:"Fundamentos",level:"basico",duration_minutes:10},{id:"m2",slug:"tiempo",title:"Ahorro de tiempo",level:"intermedio",duration_minutes:12}] }),{status:200});
}

export async function POST(req:Request){
  // Stub para marcar progreso; normalmente validar usuario
  const body = await req.json().catch(()=>({}));
  return new Response(JSON.stringify({ success:true, module_id: body.module_id, status: body.status||'completed' }),{status:200});
}

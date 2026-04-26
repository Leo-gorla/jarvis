exports.handler = async function(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const sbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  // POST: salva configuracoes no Supabase
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      await fetch(`${SUPABASE_URL}/rest/v1/configuracoes?id=neq.null`, {
        method: 'PATCH',
        headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          renda: body.renda || 0,
          meta_poupanca: body.meta_poupanca || 0,
          teto_variavel: body.teto_variavel || 0,
          reserva_viagem: body.reserva_viagem || 0,
          updated_at: new Date().toISOString()
        })
      });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  }

  // GET: busca todos os dados
  async function queryTable(table, params = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: sbHeaders
    });
    return res.json();
  }

  try {
    const [tResult, fResult, pResult, cResult] = await Promise.allSettled([
      queryTable('transacoes', 'select=*&order=data.desc'),
      queryTable('fixos', 'select=*&ativo=eq.true'),
      queryTable('parcelas', 'select=*'),
      queryTable('configuracoes', 'select=*&limit=1')
    ]);

    const tData = tResult.status === 'fulfilled' ? tResult.value : [];
    const fData = fResult.status === 'fulfilled' ? fResult.value : [];
    const pData = pResult.status === 'fulfilled' ? pResult.value : [];
    const cData = cResult.status === 'fulfilled' ? cResult.value : [];

    if (tResult.status === 'rejected') console.error('Transacoes falhou:', tResult.reason);
    if (fResult.status === 'rejected') console.error('Fixos falhou:', fResult.reason);
    if (pResult.status === 'rejected') console.error('Parcelas falhou:', pResult.reason);
    if (cResult.status === 'rejected') console.error('Configuracoes falhou:', cResult.reason);

    const transactions = (Array.isArray(tData) ? tData : []).map(t => ({
      id: t.id, date: t.data, month: t.data ? t.data.substr(0, 7) : '',
      description: t.descricao, amount: t.valor, category: t.categoria || 'Outros', type: t.tipo || 'despesa'
    }));

    const fixos = (Array.isArray(fData) ? fData : []).map(f => ({
      id: f.id, descricao: f.nome, valor: f.valor, categoria: f.categoria || 'Outros', ativo: f.ativo
    }));

    const parcelas = (Array.isArray(pData) ? pData : []).map(p => ({
      id: p.id, descricao: p.nome, valor: p.valor_parcela,
      totalParcelas: p.total_parcelas, parcelasPagas: p.parcelas_pagas,
      parcelasRestantes: p.total_parcelas - p.parcelas_pagas, vencimento: null, status: 'Ativo'
    }));

    const config = cData[0] || { renda: 5500, meta_poupanca: 1000, teto_variavel: 741, reserva_viagem: 500 };

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ transactions, fixos, parcelas, config })
    };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};

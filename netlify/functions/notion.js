exports.handler = async function(event, context) {
  const NOTION_TOKEN  = process.env.NOTION_TOKEN;
  const DB_TRANSACOES = process.env.NOTION_DB_ID       || '05a306e12e124c45aead9f18b49cda26';
  const DB_FIXOS      = process.env.NOTION_DB_FIXOS    || '7532732c8fad4c8ea21b67c3a52930bf';
  const DB_PARCELAS   = process.env.NOTION_DB_PARCELAS || 'b412720b97f94f78865cb10fcae03679';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  async function queryDB(dbId) {
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 200 })
    });
    return res.json();
  }

  try {
    const [tResult, fResult, pResult] = await Promise.allSettled([
      queryDB(DB_TRANSACOES),
      queryDB(DB_FIXOS),
      queryDB(DB_PARCELAS)
    ]);

    // Extrai valor apenas se fulfilled, senao usa objeto vazio
    const tData = tResult.status === 'fulfilled' ? tResult.value : {};
    const fData = fResult.status === 'fulfilled' ? fResult.value : {};
    const pData = pResult.status === 'fulfilled' ? pResult.value : {};

    // Log de falhas para debug no Netlify
    if (tResult.status === 'rejected') console.error('Transacoes falhou:', tResult.reason);
    if (fResult.status === 'rejected') console.error('Fixos falhou:', fResult.reason);
    if (pResult.status === 'rejected') console.error('Parcelas falhou:', pResult.reason);

    // Transacoes
    const transactions = (tData.results || []).map(p => {
      const props = p.properties;
      return {
        id:          p.id,
        date:        props.Data?.date?.start || '',
        month:       props.Data?.date?.start?.substr(0, 7) || '',
        description: props.Descricao?.title?.[0]?.text?.content || '',
        amount:      props.Valor?.number || 0,
        category:    props.Categoria?.select?.name || 'Outros',
        type:        'debit'
      };
    }).filter(t => t.description && t.amount > 0);

    // Fixos
    const fixos = (fData.results || []).map(p => {
      const props = p.properties;
      return {
        id:        p.id,
        descricao: props.Descricao?.title?.[0]?.text?.content || '',
        valor:     props.Valor?.number || 0,
        categoria: props.Categoria?.select?.name || 'Outros',
        ativo:     props.Ativo?.select?.name === 'Sim'
      };
    }).filter(f => f.ativo);

    // Parcelas
    const parcelas = (pData.results || []).map(p => {
      const props = p.properties;
      const total = props.TotalParcelas?.number || 0;
      const pagas = props.ParcelasPagas?.number || 0;
      return {
        id:                p.id,
        descricao:         props.Descricao?.title?.[0]?.text?.content || '',
        valor:             props.Valor?.number || 0,
        totalParcelas:     total,
        parcelasPagas:     pagas,
        parcelasRestantes: total - pagas,
        vencimento:        props.Vencimento?.number || null,
        status:            props.Status?.select?.name || 'Ativo'
      };
    }).filter(p => p.status === 'Ativo');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ transactions, fixos, parcelas })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

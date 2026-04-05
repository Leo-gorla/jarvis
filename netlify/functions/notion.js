exports.handler = async function(event, context) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_DB_ID = process.env.NOTION_DB_ID || '05a306e12e124c45aead9f18b49cda26';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 200 })
    });

    const data = await response.json();

    if (!data.results) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Sem dados' }) };
    }

    const transactions = data.results.map(p => {
      const props = p.properties;
      return {
        id: p.id,
        date: props.Data?.date?.start || '',
        month: props.Data?.date?.start?.substr(0, 7) || '',
        description: props.Descricao?.title?.[0]?.text?.content || '',
        amount: props.Valor?.number || 0,
        category: props.Categoria?.select?.name || 'Outros',
        type: 'debit'
      };
    }).filter(t => t.description && t.amount > 0);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ transactions })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

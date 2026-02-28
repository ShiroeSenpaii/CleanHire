const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.log('Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID first.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

async function create(table, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`${table} create failed: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  try {
    const company = await create('Companies', {
      name: 'Demo Clean Co',
      ownerName: 'Jane Owner',
      ownerEmail: 'owner@example.com',
      ownerPhone: '+15551230001',
      channel: 'sms'
    });

    const companyId = company.id;
    const defaults = [
      ['Contract', 'Signed employment contract', 1],
      ['W9', 'W9 document upload', 2],
      ['ID', 'Government photo ID', 3],
      ['DirectDeposit', 'Direct deposit form/document', 4]
    ];

    for (const [name, description, order] of defaults) {
      await create('RequiredItems', { companyId, name, description, required: true, order });
    }

    await create('FAQ', {
      companyId,
      question: 'Where do I park at the office?',
      approved_answer: 'Use the rear lot by the blue gate.',
      tags: 'parking,office'
    });

    console.log('Seed complete. Company ID:', companyId);
  } catch (error) {
    console.error('Seed failed.', error.message);
    console.log('If table fields are missing, create schema exactly as documented in README/airtable_schema.md.');
    process.exit(1);
  }
}

main();

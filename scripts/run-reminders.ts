const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const secret = process.env.CRON_SHARED_SECRET || 'dev-cron-secret';

async function main() {
  const res = await fetch(`${appUrl}/api/owner/reminders`, {
    method: 'POST',
    headers: { 'x-cron-secret': secret }
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Reminder run failed', data);
    process.exit(1);
  }
  console.log('Reminder run result:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

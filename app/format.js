export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function money(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2,minimumFractionDigits:amount % 1 ? 2 : 0}).format(amount) : '—';
}
export function date(value) {
  const stamp = new Date(value);
  return Number.isNaN(+stamp) ? 'Not announced' : new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'}).format(stamp) + ' UTC';
}
export function timeLeft(value) {
  const minutes = Math.ceil((+new Date(value) - Date.now()) / 60000);
  if (!Number.isFinite(minutes)) return 'No deadline';
  if (minutes <= 0) return 'Entries closed';
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d ${Math.floor(minutes % 1440 / 60)}h left`;
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m left` : `${minutes}m left`;
}
export const isOpen = bounty => +new Date(bounty.deadline) > Date.now() && !['closed','resolved','draft'].includes(bounty.status);
export const count = value => Number(value ?? 0).toLocaleString('en-US');
export function score(value, column) {
  if (value == null) return '—';
  return /^performance\.judge\.(win_rate|interval_low|interval_high)_micro$/.test(column?.source || '') ? (Number(value)/10000).toFixed(2) + '%' : esc(value);
}

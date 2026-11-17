const origin = 'https://make.fun/api';
const answers = new Map();
const pending = new Map();

// Every revisit revalidates. Minute-bound ETags keep bodies reusable without hiding changes.
export function get(path) {
  if (pending.has(path)) return pending.get(path);
  const previous = answers.get(path);
  const request = (async () => {
    const response = await fetch(origin + path, {
      method: 'GET', mode: 'cors', credentials: 'omit',
      headers: previous?.tag ? { 'If-None-Match': previous.tag } : {},
      signal: AbortSignal.timeout(25000)
    });
    if (response.status === 304 && previous) return previous.body;
    if (!response.ok) throw new Error(`make.fun returned ${response.status}. Please try again.`);
    const body = await response.json();
    answers.set(path, { body, tag: response.headers.get('etag') });
    return body;
  })().finally(() => pending.delete(path));
  pending.set(path, request);
  return request;
}
export const getBoard = cursor => get('/competitions?activity=times&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''));
export const getBounty = slug => get('/competitions/' + encodeURIComponent(slug) + '?submissions=summary');
export const getLeaderboard = slug => get('/competitions/' + encodeURIComponent(slug) + '/leaderboard');
export const getProfile = handle => get('/profiles/' + encodeURIComponent(handle));

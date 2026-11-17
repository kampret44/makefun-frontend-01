import { getBoard, getBounty, getLeaderboard, getProfile } from './api.js';
import { boardShell, boardResults, bounty, leaderboard, profile } from './views.js';
import { esc } from './format.js';
const app = document.querySelector('#app');
let generation = 0;
let boardItems = [];
let activeState;
let renderedBoard = false;

function routeState() {
  const [path, query=''] = (location.hash.slice(1) || '/').split('?');
  const params = new URLSearchParams(query);
  return {path, parts:path.split('/').filter(Boolean).map(decodeURIComponent), page:Math.max(1,Number(params.get('page')) || 1), filter:['open','closed'].includes(params.get('filter')) ? params.get('filter') : 'all', query:params.get('q') || ''};
}
async function loadBoard() {
  let cursor;
  const items=[];
  do {
    const data=await getBoard(cursor);
    items.push(...(data.items || []));
    cursor=data.next_cursor;
  } while(cursor);
  return items;
}
async function render(force=false) {
  const token=++generation;
  window.__shotReady=false;
  try {
    const state=routeState();
    activeState=state;
    const isBoard=state.parts.length===0;
    if (isBoard && renderedBoard && !force) {
      app.innerHTML=boardShell(boardItems,state);
      window.__shotReady=true;
      return;
    }
    renderedBoard=false;
    app.innerHTML='<div class="loading"><span class="loader"></span><h2>Finding the good stuff…</h2><p>Reading live data from make.fun.</p></div>';
    let html;
    let title;
    if (isBoard) {
      boardItems=await loadBoard();
      html=boardShell(boardItems,state); title='Bounty board';
    } else if (state.parts[0]==='bounty' && state.parts[1] && state.parts[2]==='leaderboard') {
      const data=await getLeaderboard(state.parts[1]);
      state.page=Math.min(state.page,Math.max(1,Math.ceil((data.entries?.length || 0)/25)));
      html=leaderboard(data,state.page); title='Leaderboard';
    } else if (state.parts[0]==='bounty' && state.parts.length===2) {
      const data=await getBounty(state.parts[1]); html=bounty(data);title=data.title;
    } else if (state.parts[0]==='profile' && state.parts.length===2) {
      const data=await getProfile(state.parts[1]);
      state.page=Math.min(state.page,Math.max(1,Math.ceil((data.solutions?.length || 0)/25)));
      html=profile(data,state.page);title='@'+data.handle;
    } else {
      html='<div class="empty"><h1>Page not found</h1><a href="#/">Return to the bounty board →</a></div>'; title='Page not found';
    }
    if(token!==generation) return;
    app.innerHTML=html;
    renderedBoard=isBoard;
    document.title=title+' / make.fun Fieldwork';
    document.querySelector('#section-label').textContent=title;
    document.querySelector('.nav-board').classList.toggle('selected',isBoard);
    window.scrollTo(0,0);
    window.__shotReady=true;
  } catch(error) {
    if(token!==generation) return;
    app.innerHTML=`<div class="empty error"><h1>Couldn’t load this page</h1><p>${esc(error.message)}</p><button class="primary-button" id="retry">Try again ↻</button><p><a href="#/">Back to bounties</a></p></div>`;
    window.__shotReady=true;
  }
}
app.addEventListener('click',event=>{
  if(event.target.closest('#retry')) render(true);
  if(event.target.closest('[data-rules]')) {
    event.preventDefault();
    const rules=document.querySelector('#rules');
    rules.open=true;
    rules.scrollIntoView({behavior:'smooth'});
  }
  const filter=event.target.closest('[data-filter]');
  if(filter) location.hash=`#/?filter=${filter.dataset.filter}&q=${encodeURIComponent(activeState.query)}`;
});
app.addEventListener('input',event=>{
  if(event.target.id!=='search') return;
  activeState.query=event.target.value;
  activeState.page=1;
  history.replaceState(null,'',`#/?filter=${activeState.filter}&q=${encodeURIComponent(activeState.query)}`);
  document.querySelector('#board-results').innerHTML=boardResults(boardItems,activeState);
});
document.querySelector('#refresh').addEventListener('click',()=>render(true));
window.addEventListener('hashchange',()=>render());
render();

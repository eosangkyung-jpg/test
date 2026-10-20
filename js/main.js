// 예시 클래스 데이터 (수업용 가상 데이터)
const CLASSES = [
  { category: '도자기',   title: '물레로 빚는 나만의 머그컵',     area: '서울 성수', time: '2시간',   price: 48000, icon: '🏺', color: 'var(--clay)' },
  { category: '도자기',   title: '핸드빌딩 접시 만들기',          area: '경기 분당', time: '2시간',   price: 39000, icon: '🍽️', color: 'var(--clay)' },
  { category: '베이킹',   title: '주말 아침 휘낭시에 & 마들렌',    area: '서울 연남', time: '2.5시간', price: 45000, icon: '🧁', color: 'var(--bake)' },
  { category: '베이킹',   title: '천연발효 캄파뉴 클래스',         area: '서울 망원', time: '3시간',   price: 55000, icon: '🥖', color: 'var(--bake)' },
  { category: '가죽공예', title: '손바느질 카드지갑',              area: '서울 을지로', time: '2시간', price: 42000, icon: '👛', color: 'var(--leather)' },
  { category: '플라워',   title: '계절 꽃 핸드타이드 부케',        area: '서울 서촌', time: '1.5시간', price: 38000, icon: '💐', color: 'var(--flower)' },
  { category: '드로잉',   title: '처음 그리는 수채화 풍경',        area: '경기 수원', time: '2시간',   price: 32000, icon: '🎨', color: 'var(--draw)' },
  { category: '향수',     title: '나만의 시그니처 향수 50ml',      area: '서울 한남', time: '1.5시간', price: 46000, icon: '🧴', color: 'var(--scent)' },
  { category: '향수',     title: '소이 캔들 & 디퓨저 세트',        area: '경기 일산', time: '2시간',   price: 40000, icon: '🕯️', color: 'var(--scent)' },
];

const cardsEl = document.getElementById('cards');
const emptyEl = document.getElementById('emptyMsg');
const filtersEl = document.getElementById('filters');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

let currentFilter = 'all';
let currentQuery = '';

const formatPrice = (n) => n.toLocaleString('ko-KR') + '원';

function renderCards() {
  const q = currentQuery.trim().toLowerCase();
  const list = CLASSES.filter((c) => {
    const matchCategory = currentFilter === 'all' || c.category === currentFilter;
    const matchQuery = !q || [c.title, c.category, c.area].some((v) => v.toLowerCase().includes(q));
    return matchCategory && matchQuery;
  });

  cardsEl.innerHTML = list.map((c) => `
    <article class="card">
      <div class="card__thumb" style="background:${c.color}">${c.icon}</div>
      <div class="card__body">
        <p class="card__meta">${c.category} · ${c.area} · ${c.time}</p>
        <h3 class="card__title">${c.title}</h3>
        <div class="card__foot">
          <span class="card__price">${formatPrice(c.price)}</span>
          <button class="card__btn" type="button">예약하기</button>
        </div>
      </div>
    </article>
  `).join('');

  emptyEl.hidden = list.length > 0;
}

function setFilter(filter) {
  currentFilter = filter;
  filtersEl.querySelectorAll('.chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.filter === filter);
  });
  renderCards();
}

filtersEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  currentQuery = '';
  searchInput.value = '';
  setFilter(chip.dataset.filter);
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentQuery = searchInput.value;
  setFilter('all');
  document.getElementById('classes').scrollIntoView();
});

cardsEl.addEventListener('click', (e) => {
  if (e.target.closest('.card__btn')) {
    alert('클래스로 앱에서 날짜와 인원을 선택해 예약할 수 있어요!');
  }
});

// 모바일 메뉴
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// 스크롤 시 헤더 경계선
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

// 숫자 카운트 애니메이션
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// 스크롤 등장 애니메이션
const revealTargets = document.querySelectorAll('.section__head, .step, .about, .team, .news li, .cta__inner');
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

renderCards();
revealTargets.forEach((el) => observer.observe(el));

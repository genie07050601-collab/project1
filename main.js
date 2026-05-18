const feedContainer = document.getElementById('feed-container');
const scrollCountEl = document.getElementById('scroll-count');
const warningModal = document.getElementById('warning-modal');

let count = 0;
const MAX_SCROLLS = 10;

// 임의의 숏폼 콘텐츠를 생성하기 위한 색상 배열
const colors = ['#1e3799', '#3c6382', '#38ada9', '#78e08f', '#60a3bc', '#e58e26', '#b71540', '#0c2461', '#079992'];

// 새로운 숏폼 콘텐츠(카드)를 생성하여 추가하는 함수
function createNewCard() {
    count++;
    scrollCountEl.textContent = count;

    // 10회 도달 시 차단 로직 실행
    if (count >= MAX_SCROLLS) {
        showWarning();
        return;
    }

    // 새 카드 엘리먼트 생성
    const newCard = document.createElement('div');
    newCard.className = 'short-video-card';
    
    // 무작위 배경색 및 텍스트 설정
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    newCard.style.backgroundColor = randomColor;
    newCard.innerHTML = `
        <h2>Shorts 콘텐츠 ${count + 1}</h2>
        <p>계속 보시겠습니까? (제한까지 ${MAX_SCROLLS - count}번 남음)</p>
    `;
    
    feedContainer.appendChild(newCard);
}

// 스크롤 감지 이벤트 리스너
function handleScroll() {
    // window.innerHeight + window.scrollY 가 문서 전체 높이(document.body.offsetHeight)에 근접하면 바닥에 닿은 것
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        createNewCard();
    }
}

// 10회 제한 시 호출되는 함수
function showWarning() {
    // 1. 스크롤 이벤트 리스너 제거 (더 이상 새로운 콘텐츠 로드 안 됨)
    window.removeEventListener('scroll', handleScroll);
    
    // 2. 스크롤 바를 없애고 페이지 이동을 막아 더 이상의 탐색 차단
    document.body.style.overflow = 'hidden';
    
    // 3. 경고 모달 팝업 표시
    warningModal.classList.remove('hidden');
}

// 최초 이벤트 리스너 등록
window.addEventListener('scroll', handleScroll);
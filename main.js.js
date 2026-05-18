// script.js
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".video-card");
    const currentCountEl = document.getElementById("current-count");
    const blockOverlay = document.getElementById("block-overlay");
    
    const LIMIT = 5; // 제한할 숏폼 개수
    let viewedCards = new Set(); // 중복 카운트 방지를 위한 Set

    // 브라우저 관찰자(Observer) 설정
    const observerOptions = {
        root: document.getElementById("feed-container"), // 부모 컨테이너 기준
        threshold: 0.6 // 영상의 60% 이상이 화면에 보일 때 감지
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 카드가 화면에 완전히 들어왔을 때
            if (entry.isIntersecting) {
                const targetCard = entry.target;

                // 이미 본 카드가 아니라면 새로 추가 및 카운트 증가
                if (!viewedCards.has(targetCard)) {
                    viewedCards.add(targetCard);
                    
                    const currentCount = viewedCards.size;
                    currentCountEl.textContent = currentCount;

                    // 제한 횟수를 초과했는지 체크
                    if (currentCount > LIMIT) {
                        blockScreen();
                    }
                }
            }
        });
    }, observerOptions);

    // 모든 숏폼 카드들을 관찰 대상으로 등록
    cards.forEach(card => observer.observe(card));

    // 화면 차단 함수
    function blockScreen() {
        blockOverlay.classList.remove("hidden");
        // 스크롤이 더이상 불가능하도록 컨테이너 잠금
        document.getElementById("feed-container").style.overflowY = "hidden";
    }
});
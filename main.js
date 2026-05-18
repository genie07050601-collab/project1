let attachedImageData = null;

const imageInput = document.getElementById('image-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-img-btn');
const submitBtn = document.getElementById('submit-btn');
const boardFeed = document.getElementById('board-feed');

// 1. 이미지 업로드 시 미리보기 기능
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            attachedImageData = e.target.result;
            imagePreview.src = attachedImageData;
            imagePreviewContainer.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// 2. 첨부된 이미지 제거 버튼
removeImgBtn.addEventListener('click', () => {
    attachedImageData = null;
    imageInput.value = '';
    imagePreviewContainer.classList.add('hidden');
    imagePreview.src = '';
});

// 3. 게시글 등록 기능
submitBtn.addEventListener('click', () => {
    const usernameInput = document.getElementById('username');
    const contentInput = document.getElementById('content');

    const username = usernameInput.value.trim();
    const content = contentInput.value.trim();

    if (!username || !content) {
        alert('닉네임과 내용을 모두 입력해주세요!');
        return;
    }

    createPost(username, content, attachedImageData);

    // 입력창 초기화
    contentInput.value = '';
    usernameInput.value = '';
    attachedImageData = null;
    imageInput.value = '';
    imagePreviewContainer.classList.add('hidden');
    imagePreview.src = '';
});

// 4. 게시글 DOM 생성 함수
function createPost(author, text, imgSrc) {
    const postArticle = document.createElement('article');
    postArticle.classList.add('post');

    // 현재 시간 계산
    const now = new Date();
    const timeString = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 이미지 태그 생성 여부
    const imgHtml = imgSrc ? `<img src="${imgSrc}" class="post-img" alt="업로드 이미지">` : '';

    postArticle.innerHTML = `
        <div class="post-header">
            <div class="post-author">${escapeHtml(author)}</div>
            <div class="post-time">${timeString}</div>
        </div>
        <div class="post-text">${escapeHtml(text)}</div>
        ${imgHtml}
        
        <div class="post-actions">
            <button class="action-btn like-btn">❤️ 좋아요 (<span class="like-count">0</span>)</button>
        </div>

        <div class="comments-section">
            <ul class="comment-list"></ul>
            <div class="comment-input-box">
                <input type="text" class="comment-input" placeholder="댓글을 남겨보세요...">
                <button class="comment-submit">등록</button>
            </div>
        </div>
    `;

    // 좋아요 기능 바인딩
    const likeBtn = postArticle.querySelector('.like-btn');
    const likeCountSpan = postArticle.querySelector('.like-count');
    let isLiked = false;
    let likeCount = 0;

    likeBtn.addEventListener('click', () => {
        if (!isLiked) {
            likeCount++;
            likeBtn.classList.add('liked');
        } else {
            likeCount--;
            likeBtn.classList.remove('liked');
        }
        likeCountSpan.textContent = likeCount;
        isLiked = !isLiked;
    });

    // 댓글 등록 기능 바인딩
    const commentList = postArticle.querySelector('.comment-list');
    const commentInput = postArticle.querySelector('.comment-input');
    const commentSubmit = postArticle.querySelector('.comment-submit');

    const handleCommentSubmit = () => {
        const commentText = commentInput.value.trim();
        if(!commentText) return;

        const li = document.createElement('li');
        li.classList.add('comment-item');
        li.innerHTML = `<span class="comment-user">익명:</span>${escapeHtml(commentText)}`;
        
        commentList.appendChild(li);
        commentInput.value = '';
    };

    commentSubmit.addEventListener('click', handleCommentSubmit);
    commentInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleCommentSubmit();
    });

    // 최신글이 위로 오도록 추가
    boardFeed.insertBefore(postArticle, boardFeed.firstChild);
}

// 보안을 위한 HTML 텍스트 이스케이프 함수
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
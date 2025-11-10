// ===== UTILITY FUNCTIONS =====

/*
* Debounce 함수 - 함수 실행 빈도를 제한합니다
*
* 사용 이유: 스크롤, 리사이즈 같은 이벤트는 초당 수십~수백번 발생합니다.
* 이름 그대로 처리하면 성능이 크게 저하됩니다.
* debounce는 마지막 호출 후 일정 시간이 지나면 한 번만 실행되도록 합니다.
* 
* @param {Function} func - 실행할 함수
* @param {number} wait - 대기 시간 (밀리초)
* @param {boolean} immediate - 즉시 실행 여부
* @returns {Function} Debounced 함수
* 
* 예시:
* window.addEventListener('scroll', debounce(handleScroll, 100));
* -> 스크롤이 멈춘 후 100ms 뒤에 handleScroll 실행
*/

function debounce(func, wait, immediate) {
    let timeout; // 타이머를 저장할 변수
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args); // immediate가 false면 나중에 실행
        };
        const callNow = immediate && !timeout; // immediate면 즉시 실행
        clearTimeout(timeout); // 기존 타이머 취소
        timeout = setTimeout(later, wait); // 새 타이머 설정
        if(callNow) func(...args); // 즉시 실행 조건이면 실행
    }
}

/**
 * Throttle 함수 - 일정 시간 간격으로만 함수를 실행합니다.
 * 
 * debounce와의 차이:
 * - debounce: 마지막 호출 후 대기 -> 검색어 입력에 적합
 * - throttle: 일정 간격마다 실행 -> 스크롤 이벤트에 적합
 * 
 * @param {Function} funce - 실행할 함수
 * @param {number} limit - 최소 실행 간격 (밀리초)
 * @returns {Function} Throttled 함수
 * 
 * 예시:
 * window.addEventListener('scroll', throttle(updatePositon, 16));
 * -> 16ms(60fps)마다 한 번씩만 updatePosition 실행
 */
function throttle(func, limit) {
    let inThrottle; //쓰로들 상태를 저장
    return function(...args) {
        if (!inThrottle) { // 쓰로들 중이 아니면
            func.apply(this, args); // 함수 실행
            inThrottle = true // 쓰로들 시작
            setTimeout(() => inThrottle - false, limit); // limit 후 해제
        }
    };
}

/**
 * 안전하게 DOM 요소를 선탣합니다
 * 
 * querySelector를 직접 사용하면 요소가 없을 때 null이 반환되어 에러가 발생할 수 있습니다.
 * 이 함수는 에러를 처리하고 안전하게 요소를 반환합니다.
 * 
 * @param {string} selector - CSS 선택자
 * @param {boolean} all - 여러 개 선택 여부 (true면 querySelectorAll 사용)
 * @returns {Element|NodeList|null} 선택된 요소(들) 또는 null
 * 
 * 예시:
 * const navbar = getElement('.navbar');
 * const cards = getElement('.card', true) // 모든 .card 요소 선택
 */
function getElement(selector, all = false) {
    try {
        return all ? document.querySelectorAll(selector) : document.querySelector(selector);
    } catch (error) {
        console.error(`Error selecting element: ${selector}`, error);
        return null; // 에러 발생 시 null 반환
    }
}

/**
 * 이벤트 리스너를 안전하게 추가합니다
 * 
 * addEventListener를 직접 사용하면 요소가 없을 때 에러가 발생합니다.
 * 이 함수는 요소 존재 여부를 확인하고 안전하게 이벤트를 추가합니다.
 * 
 * @param {Element|string} element - 요소 또는 선택자
 * @param {string} event - 이벤트 타입 ('click', 'scroll' 등)
 * @param {Function} handler - 이벤트 핸들러 함수
 * @param {Object} options - 이벤트 옵션
 */

function addEventListenerSafe(element, event, handler, options ={}) {
    try {
        // 문자열이면 요소 선택, 아니면 그대로 사용
        const el = typeof element === 'string' ? getElement(element) : element;
        if (el && typeof handler === 'function')  {
            el.addEventListener(event, handler, options);
        }
    } catch (error) {
        console.error('Error adding event listener:', error);
    }
}

/**
 * 요소가 화면(뷰포트)에 보이는지 확인합니다
 * 
 * 스크롤 애니메이션, 지연 로딩 등에 사용됩니다.
 * 
 * @param {Element} element - 확인할 요소
 * @param {number} threshold - 가시성 임계값 (0-1, 0.1 = 10% 보이면 true)
 * @returns {boolean} 화면에 보이면 true
 * 
 * 예시:
 * if (isElementInViewport(card, 0.5)) {
 *      card.classList.add('visible'); // 50% 이상 보이면 visible 클래스 추가
 * }
 */
function isElementInViewport(element, threshold = 0.1) {
    if (!element) return false;

    const rect = element.getBoundingClientRect(); // 요소의 위치와 크기 정보
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // 수직으로 화면에 보이는지
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height * threshold) >= 0);
    // 수평으로 화면에 보이는지
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width * threshold) >= 0);

    return vertInView && horInView; // 둘 다 true여야 보이는 것
}

/**
 * 특정 요소로 부드럽게 스크롤합니다
 * 
 * 네비게이션 메뉴 클릭 시 해당 섹션으로 부드럽게 이동하는 효과를 만듭니다.
 * 브라우저 기본 스크롤보다 더 세밀한 제어가 가능합니다.
 * 
 * @param {Element|string} target - 이동할 요소 또는 선택자
 * @param {number} offset - 목표 위치에서 추가로 이동할 거리 (음수 가능)
 * @param {number} duration - 애니메이션 지속 시간 (밀리초)
 * 
 * 예시:
 * smoothScrollTo('#features', 80, 1000);
 * -> #features 섹션으로 1초에 걸쳐 스크롤, 상단에서 80px 띄움 (네비바 높이 고려)
 */
function smoothScrollTo(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? getElement(target) : target;
    if (!element) return;

    const targetPosition = element.offsetTop - offset; // 목표 위치 계산
    const startPosition = window.pageYOffset; // 현재 스크롤 위치
    const distance = targetPosition - startPosition; // 이동해야 할 거리
    let starTime = null;

    // 애니메이션 프레임마다 실행되는 함수
    function animation(currentTime) {
        if (starTime === null) starTime = currentTime;
        const timeElapsed = currentTime - starTime; // 경과 시간
        const run = ease(timeElapsed, startPosition, distance, duration); // 이징 적용
        window.scrollTo(0, run); // 스크롤 이동
        if (timeElapsed < duration) requestAnimationFrame(animation); // 계속 실행
    }

    // easeInOutQuad 이징 함수 - 처음과 끝이 부드러운 곡선
    function ease(t, b, c, d) {
        t /= d / 2;
        if(t < 1) return c / 2 * t * t + b; // 가속
        t--;
        return -c / 2 * (t * (t - 2) -1 ) + b; //감속
    }

    requestAnimationFrame(animation); // 애니메이션 시작
}

/** 
 * 고유한 ID를 생성합니다
 * 
 * 동적으로 생성되는 요소에 고유한 ID를 부여할 때 사용합니다.
 * 
 * @param {string} prefix - ID 접두사
 * @returns {string} 고유 ID
 * 
 * 예시:
 * const id = generateId('model'); // "modal-1609459200000-abc123"
 */
function generateId(prefix = 'id') {
    return `${prefix}-${Data.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 숫자를 천 단위로 쉼표를 추가하여 포맷팅합니다
 * 
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷된 문자열
 * 
 * 예시:
 * formatNumber(1000000); // "1,000,000"
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 모바일 디바이스인지 확인합니다
 * 
 * 모바일과 데스크톱에서 다른 동작을 구현할 때 사용합니다.
 * 예: 모바일에서는 호버 효과 비활성화
 * 
 * @returns {boolean} 모바일이면 true
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 터치 디바이스인지 확인합니다
 * 
 * 터치 이벤트를 지원하는 디바이스인지 확인합니다.
 * 최근 노트북도 터치를 지원하므로 isMobile()과 다릅니다.
 * 
 * @returns {boolean} 터치를 지원하면 true
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 현재 뷰포트(화면) 크기를 반환합니다
 * 
 * 반응형 동작을 구현할 때 사용합니다.
 * 
 * @returns {Object} {width: 숫자, height: 숫자}
 */
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

/**
 * 사용자가 애니메이션 감소를 선호하는지 확인합니다
 * 
 * 접근성 설정에서 "애니메이션 줄이기"를 켠 사용자를 위한 것입니다.
 * 멀미를 유발할 수 있는 애니메이션을 비활성화해야합니다.
 * 
 * @returns {boolean} 애니메이션 감소를 선호하면 true
 * 
 * 예시:
 * if (prefersReducedMotion()) {
 *      // 애니메이션 없이 즉시 표시
 * } else {
 *      // 부드러운 애니메이션 적용
 * }
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 현재 스크롤 위치를 반환합니다
 * 
 * @returns {Object} {x: 가로 스크롤, y: 세로 스크롤}
 */
function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

/**
 * 요소가 실제로 보이는지 확인합니다
 * 
 * display: none, visibility: hidden, opacity: 0인 요소는 false 반환
 * 
 * @param {Element} element - 확인할 요소
 * @returns {boolean} 보이면 true
 */
function isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

/**
 * 지정된 시간만큼 대기하는 Promise를 반환합니다
 * 
 * async/await과 함께 사용하여 지연 시간을 만듭니다.
 * 
 * @param {number} ms - 대기 시간 (밀리초)
 * @returns {Promise} Promise
 * 
 * 예시:
 * async function showMessage() {
 *      alert('첫 번째');
 *      await wait(1000); // 1초 대기
 *      alert ('두 번째');
 * }
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
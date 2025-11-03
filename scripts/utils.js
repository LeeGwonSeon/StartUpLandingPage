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
// ===== ANIMATION CONTROLLER =====
// 이 파일은 페이지의 모든 에니메이션을 중앙에서 관리합니다.
// 스크롤 시 요소가 나타나는 효과, 숫자 카운팅, 네비바 변화 등을 처리합니다.

/**
 * AnimationManager 클래스
 * 
 * 역할:
 * - 페이지 스크롤 시 요소들이 순차적으로 나타나는 효과 관리
 * - Intersection Observer API를 사용해 성능 최적화
 * - 각 요소별 맞춤 애니메이션 적용
 * 
 * 동작 원리:
 * 1. .fade-in 클래스를 가진 요소들을 찾음
 * 2. Intersection Observer로 화면에 들어오는지 감시
 * 3. 화면에 들어오면 .visible 클래스 추가 -> CSS 애니메이션 시작
 */
class AnimationManager {
    constructor() {
        this.observer = null; // Intersection Observer 인스턴스
        this.animatedElements = new Set(); // 이미 애니메이션된 요소들 (중복 방지)
        this.init(); // 초기화 시작
    }

    /**
     * 애니메이션 시스템 초기화
     * 
     * 사용자가 "애니메이션 줄이기" 설정을 켰는지 확인하고,
     * 켜져 있으면 모든 애니메이션을 비활성화합니다 (접근성 고려)
     */
    init() {
        // 애니메이션 감소 설정 확인 (멀미 예방 등)
        if (prefersReducedMotion()) {
            this.disableAnimations(); // 모든 애니메이션 즉시 완료 상태로
            return;
        }

        // 각 애니메이션 시스템 설정
        this.setupIntersectionObserver(); // 스크롤 애니메이션
        this.setupScrollAnimations(); // 네비바 스크롤 효과
        this.setupCounterAnimations(); // 숫자 카운팅 애니메이션
    }

    /**
     * Intersection Observer 설정
     * 
     * Intersection Observer란?
     * - 요소가 화면에 보이는지 감시하는 최신 브라우저 API
     * - 기존 scroll 이벤트보다 훨씬 성능이 좋음 (네이티브 최적화)
     * 
     * 왜 사용하나?
     * scroll 이벤트는 초당 60번 발생 -> 성능 저하
     * Intersection Observer는 필요할 때만 실행 -> 성능 우수
     */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1, // 요소의 10%가 보이면 트리거
            rootMargin: '0px 0px -50px 0px' // 화면 하단에서 50px 전에 미리 트리거
            // -> 사용자가 보기 전에 미리 애니메이션 시작해서 더 자연스러움
        };

        // Observer 생성
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 요소가 화면에 들어왔고, 이직 애니메이션 안 했으면
                if (entry.isIntersection && !this.animatedElements.has(entry.target)) {
                    this.animatedElement(entry.target); // 애니메이션 시작
                    this.animatedElements.add(entry.target); // 중복 방지용 기록
                }
            });
        }, options);

        // 페이지의 모든 .fade-in 요소들을 찾아서 감시 시작
        this.observeFadeElements();
    }
}
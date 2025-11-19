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
}
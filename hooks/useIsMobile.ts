import { useMediaQuery } from "./useMediaQuery";

// Tailwind 'sm' breakpoint (640px)
// max-width: 639px까지를 모바일로 간주 (640px부터는 sm 이상)
const MOBILE_BREAKPOINT = "(max-width: 639px)";

export function useIsMobile() {
  return useMediaQuery(MOBILE_BREAKPOINT);
}

/**
 * 하위 호환성 래퍼.
 * 실제 state는 StoreProvider에서 관리되며, 이 훅은 store에서 scraps 슬라이스를 꺼내 반환합니다.
 */
import { useStore } from '../store/StoreProvider'

export function useScraps() {
  return useStore().scraps
}

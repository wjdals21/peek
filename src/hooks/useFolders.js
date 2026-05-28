/**
 * 하위 호환성 래퍼.
 * 실제 state는 StoreProvider에서 관리되며, 이 훅은 store에서 folders 슬라이스를 꺼내 반환합니다.
 * 기존 컴포넌트 import 경로를 바꾸지 않아도 됩니다.
 */
import { useStore } from '../store/StoreProvider'

export function useFolders() {
  return useStore().folders
}

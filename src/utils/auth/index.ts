import { userStore } from '/@/store/modules/user';

export function getToken(): string {
  return userStore.getTokenState;
}

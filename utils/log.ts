import { showMessage } from 'react-native-flash-message';

const TYPES = {
  s: 'success',
  i: 'info',
  d: 'danger',
  w: 'warning',
};

const common = (type: string) => ({
  type,
  icon: type,
  duration: 2000,
});

class Log {
  public success(message: string) {
    showMessage({
      message,
      ...common(TYPES.s),
    } as any);
  }

  public danger(message: string) {
    showMessage({
      message,
      ...common(TYPES.d),
    } as any);
  }

  public warning(message: string) {
    showMessage({
      message,
      ...common(TYPES.w),
    } as any);
  }

  public info(message: string) {
    showMessage({
      message,
      ...common(TYPES.i),
      duration: 5000,
    } as any);
  }
}

const log = new Log();
export { log };

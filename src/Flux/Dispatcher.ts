export interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export class Dispatcher {
  private _listeners: Array<(action: Action) => void>;

  constructor() {
    this._listeners = [];
  }

  register(callback: (action: Action) => void): void {
    this._listeners.push(callback);
  }

  dispatch(action: Action): void {
    for (const listener of this._listeners) {
      listener(action);
    }
  }
}

export const AppDispatcher = new Dispatcher();

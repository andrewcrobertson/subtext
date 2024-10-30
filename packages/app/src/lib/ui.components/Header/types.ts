export enum Mode {
  Offline = 'Offline',
  Online = 'Online',
}

export interface ModeChangeEventDetail {
  mode: Mode;
}

export type TJobTime = {
  application: string;
  active_time: number;
  icon: string;
  path: string;
  day: number;
};

export type TSubJobTime = {
  application: string;
  sub_application: string;
  active_time: number;
  day: number;
};

type base64 = string;
type application = string;
type ActiveMapValue = {
  tick: number;
  icon: base64;
  path: string;
};
export type TActiveMap = Map<application, ActiveMapValue>;

type sub_application = string;
type tick = number;
export type SubActivemapValue = Map<sub_application, tick>;
export type TSubActiveMap = Map<application, SubActivemapValue>;

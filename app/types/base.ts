export type Recordable = Record<string, any>;

export type baseModel = {
  id: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type ValueOf<T> = T[keyof T];

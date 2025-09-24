import type { baseModel } from './base';

export interface IUser extends baseModel {
  username: string;
  status?: number;
  profile: Profile;
}

export type Profile = {
  id: number;
  avatar: string;
  address?: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  introduction?: string;
  nickName: string;
  signature?: string;
  gender: number;
};

export type UserDetail = {
  id: number;
  nickName?: string;
  gender?: number;
  phone?: string;
  email?: string;
  avatar?: string;
  signature?: string;
  address?: string;
  birthDate?: Date;
  introduction?: string;
};

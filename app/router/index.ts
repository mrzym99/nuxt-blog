import { MenuTypeEnum } from '~/enum';

export type Menu = {
  name: string;
  path?: string;
  icon: string;
  type?: MenuTypeEnum;
  action?: (menu: Menu) => void;
  children?: Menu[];
};

export const menuList: Menu[] = [
  {
    name: '首页',
    path: '/',
    icon: 'ph:house',
    type: MenuTypeEnum.MENU,
  },
  {
    name: '归档',
    path: '/archive/all',
    icon: 'ph:archive-light',
    type: MenuTypeEnum.MENU,
  },
  // {
  //   name: '留言',
  //   path: '',
  //   icon: 'ph:chat-circle-text-light',
  //   type: MenuTypeEnum.MENU,
  // },
  {
    name: '关于',
    path: '/about',
    icon: 'ph:user-light',
    type: MenuTypeEnum.MENU,
  },
];

export const REG_USER_NAME = /^(?:[a-zA-Z0-9]{4,16}|(?:[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

export const REG_PWD = /^[\w@$!%*?&.]{6,18}$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^[A-Za-z0-9]{4}$/;

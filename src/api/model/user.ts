export interface loginData {
  username: string,
  password: string
}

export interface loginResponseData {
  token: string
}

export interface userInfoResponseData {
  name: string,
  avatar: string,
  roles: string[],
  buttons: string[],
  routes: string[]
}
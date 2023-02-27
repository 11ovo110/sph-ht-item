export interface trademark {
  id?: string | number,
  tmName: string,
  logoUrl: string
}

export type trademarkArr = trademark[];

export interface responseTrademarkData {
  total: number,
  records: trademarkArr
}
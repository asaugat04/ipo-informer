export interface IPOResponseDTO {
  statusCode: number;
  message: string;
  result: Result;
}

export interface Result {
  data: Daum[];
  pager: Pager;
}

export interface Daum {
  ipoId: number;
  companyName: string;
  stockSymbol: string;
  shareRegistrar: string;
  sectorName: string;
  fileName: string;
  shareType: string;
  pricePerUnit: string;
  rating: string;
  units: string;
  minUnits: string;
  maxUnits: string;
  localUnits: string;
  generalUnits: string;
  promoterUnits: string;
  mutualFundUnits: string;
  otherUnits: string;
  totalAmount: string;
  openingDateAD: string;
  openingDateBS: string;
  closingDateAD: string;
  closingDateBS: string;
  closingDateClosingTime: string;
  extendedDateAD: string;
  extendedDateBS: string;
  extendedDateClosingTime: string;
  status: string;
  fiscalYearAD: string;
  fiscalYearBS: string;
  cultureCode: string;
}

export interface Pager {
  pageNo: number;
  itemsPerPage: number;
  pagePerDisplay: number;
  totalNextPages: number;
}

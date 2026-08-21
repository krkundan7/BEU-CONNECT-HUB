export interface IBEUCollegeRecord {
  id: string;
  code: string;
  name: string;
  district: string;
  establishedYear: number;
}

export const BEU_AFFILIATED_COLLEGES: IBEUCollegeRecord[] = [
  { id: '1', code: 'BCE_BHAGALPUR', name: 'Bhagalpur College of Engineering', district: 'Bhagalpur', establishedYear: 1960 },
  { id: '2', code: 'MIT_MUZAFFARPUR', name: 'Muzaffarpur Institute of Technology', district: 'Muzaffarpur', establishedYear: 1954 },
  { id: '3', code: 'NCE_CHANDI', name: 'Nalanda College of Engineering, Chandi', district: 'Nalanda', establishedYear: 2008 },
  { id: '4', code: 'GEC_AURANGABAD', name: 'Government Engineering College, Aurangabad', district: 'Aurangabad', establishedYear: 2019 },
  { id: '5', code: 'GEC_VAISHALI', name: 'Government Engineering College, Vaishali', district: 'Vaishali', establishedYear: 2019 },
  { id: '6', code: 'GEC_BANKA', name: 'Government Engineering College, Banka', district: 'Banka', establishedYear: 2019 },
  { id: '7', code: 'GEC_GAYA', name: 'Gaya College of Engineering, Gaya', district: 'Gaya', establishedYear: 2008 },
  { id: '8', code: 'DCE_DARBHANGA', name: 'Darbhanga College of Engineering', district: 'Darbhanga', establishedYear: 1999 },
];

export class BEUCollegesService {
  static getAllColleges(): IBEUCollegeRecord[] {
    return BEU_AFFILIATED_COLLEGES;
  }

  static getCollegeByCode(code: string): IBEUCollegeRecord | undefined {
    return BEU_AFFILIATED_COLLEGES.find((c) => c.code.toLowerCase() === code.toLowerCase());
  }
}

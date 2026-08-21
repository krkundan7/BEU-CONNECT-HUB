/**
 * Regex pattern repository for BEU registration and roll numbers
 */
export const BEU_PATTERNS = {
  REGISTRATION_NO: /^2[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{2}$/, // e.g., 22101501001
  ROLL_NO: /^[0-9]{11,13}$/,
  SEMESTER_CODE: /^(1|2|3|4|5|6|7|8)$/,
  SUBJECT_CODE: /^[A-Z]{2,4}-[A-Z0-9]{3,6}$/i, // e.g., PCC-CS501
  AADHAAR_LAST4: /^[0-9]{4}$/,
};

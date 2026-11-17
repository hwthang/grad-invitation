export interface GraduationInfo {
  graduateName: string;
  university: string;
  major: string;
  graduationYear: number;
  portrait: string;

  event: {
    title: string;
    /** ISO date, e.g. 2026-12-20 */
    date: string;
    location: string;
    /** Optional street address, shown under the location when not empty. */
    address: string;
    mapUrl: string;
  };
}

export interface PatientRecord {
    id: string;
    familyName: string;
    firstName: string;
    middleName: string;
    sex: string;
    address: string;
    mobileno: string;
    dateOfBirth: string;
    age: string;
    status: string;
    nationality: string;
    broughtBy: string;
    philMember: string;
    philNumber: string;
    phicMemberName: string;
    date: string;
    time: string;
  }


export interface ConfirmationOptions {
  title?: string;
  message?: string;
}

export interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

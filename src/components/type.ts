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
    requests?: Request[];
    complaints?: string,
    history?: string,
    physicalExamBP?: string,
    physicalExamHR?: string,
    physicalExamT?: string,
    physicalExamWT?: string,
    physicalExamH?: string,
    diagnosis?: string,
    order?: string
}

interface Request {
  rhuOrBarangay: string;
  status: string;
}


export interface ConfirmationOptions {
  title?: string;
  message?: string;
}

export interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

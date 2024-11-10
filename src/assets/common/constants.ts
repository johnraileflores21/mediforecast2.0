import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

export const baseUrl = "https://api-dgreatplan.site/api";

export const medical_packaging = [
    "Bottle",
    "Blister Pack",
    "Tablet Jar",
    "Tube",
    "Vial",
    "Sachet",
    "Ampule",
    "Syringe",
    "Dropper Bottle",
    "Patch"
];

export const dosage_forms = [
    "Tablet",
    "Syrup",
    "Capsule",
    "Suspension",
    "Cream",
    "Ointment",
    "Injectible"
];

export const medicineFormData = {
    medicineGenericName: "",
    medicineBrandName: "",
    medicineStock: 0,
    totalQuantity: 0,
    medicineLotNo: "",
    medicineDosageForm: "",
    medicinePackaging: "",
    medicineDosageStrength: "",
    medicineExpiration: "",
    medicineDescription: "",
    // medicineClassification: "",
    userId: "",
    medicinePiecesPerItem: "",
};

export const vitaminFormData = {
    vitaminGenericName: "",
    vitaminBrandName: "",
    vitaminStock: 0,
    totalQuantity: 0,
    vitaminLotNo: "",
    vitaminDosageForm: "",
    vitaminPackaging: "",
    vitaminDosageStrength: "",
    vitaminExpiration: "",
    vitaminDescription: "",
    // vitaminClassification: "",
    userId: "",
    vitaminPiecesPerItem: "",
};

export const vaccineFormData = {
    vaccineName: "",
    vaccineBatchNo: "",
    vaccineDosageForm: "",
    vaccinePackaging: "",
    vaccineExpiration: "",
    vaccineDescription: "",
    // vaccineClassification: "",
    vaccinePiecesPerItem: "",
    userId: "",
    vaccineStock: 0,
    totalQuantity: 0,
};

export const inventoryFormData = {
    brandName: '',
    genericName: '',
    stock: 0,
    // stockClassification: '',
    piecesPerItem: 0,
    lotNo: '',
    dosage: '',
    type: '',
    packaging: '',
    expirationDate: '',
    description: ''
};

export const requestFormData = {
    rhuId: "",
    userId: "",
    itemId: "",
    reason: "",
    requestedQuantity: ""
};

export const itrFields = {
    familyName: "",
    firstName: "",
    middleName: "",
    status: "",
    nationality: "",
    age: "",
    sex: "",
    address: "",
    mobileno: "",
    dateOfBirth: "",
    broughtBy: "",
    philMember: "",
    philNumber: "",
    phicMemberName: "",
    date: "",
    complaints: "",
    history: "",
    physicalExamBP: "",
    physicalExamHR: "",
    physicalExamT: "",
    physicalExamWT: "",
    physicalExamPR: "",
    physicalExamH: "",
    diagnosis: "",
    order: "",
    time: "",
    rhuOrBarangay: "",
    created_at: "",
    updated_at: "",
};

export const inventoryFilters = ["All", "Medicines", "Vitamins", "Vaccine"];
export const inventoryTabs = ["Medicine", "Vitamin", "Vaccine"];

export function getTypes(data: any) {

    const types = ['medicine', 'vitamin', 'vaccine'];

    let typeVal = "";
    types.forEach(type => {
        Object.keys(data).forEach(key => {
            if(key.includes(type)) typeVal = type;
        });
    })

    return typeVal;
};

export const RHUs = [
    {"barangays": ["Sulipan", "San Juan", "Capalangan", "Sucad"]},
    {"barangays": ["Tabuyuc", "Balucuc", "Cansinala", "Calantipe"]},
    {"barangays": ["San Vicente", "Sampaloc", "Paligui", "Colgante"]}
];

export const formatDate = (dateString: any) => {
    let date;
    if(typeof dateString == 'object') {
        date = new Date(dateString.seconds * 1000 + dateString.nanoseconds / 1000000);
    } else date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
}

export const toPascalCase = (str: string) => {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const getData = (card: any, user: any) => {
    return card.requests.find((request: any) => request.rhuOrBarangay === user?.rhuOrBarangay)?.status;
}

export const getAddress = (unitOrBarangay: string) => {
    let obj = {};
    if(["1", "2", "3"].includes(unitOrBarangay)) {
        obj = unitOrBarangay == "1"
            ? { address: 'San Juan, Apalit, Pampanga' }
            : unitOrBarangay == "2"
            ? { address: 'Tabuyuc, Apalit, Pampanga' }
            : unitOrBarangay == "3"
            ? { address: 'San Vicente, Apalit, Pampanga' }
            : {}
    } else {
        const i = (RHUs.findIndex((rhu: any) => rhu?.barangays.includes(unitOrBarangay)));
        const brgy = RHUs[i].barangays.find((barangay: string) => unitOrBarangay == barangay);
        obj.address = `${brgy}, Apalit, Pampanga`;
        obj.barangay = brgy;
    }

    return obj;
}

export const capitalizeAndFormatLabel = (label: string) => {
    const specialLabels: { [key: string]: string } = {
      created_at: 'Created Date',
      updated_at: 'Updated Date',
    };

    if (specialLabels[label]) {
      return specialLabels[label];
    }

    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase()); 
};

export const ucwords = (word: string) => word.split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');


export const ucfirst = (word: string) => {
    const w = word.split('');
    const f = isNaN(w[0])
        ? w[0].toUpperCase()
        : w[0];
    return f + w.slice(1, w.length).join("");
};

export const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.6;
  
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const generateOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

export const uploadImage = async (file: File, path: string): Promise<string> => {
    const imageRef = ref(storage, `${path}/-${file.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
};
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
    medicineRegulatoryClassification: "",
    medicineDescription: "",
    medicineClassification: "",
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
    vitaminRegulatoryClassification: "",
    vitaminDescription: "",
    vitaminClassification: "",
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
    vaccineClassification: "",
    vaccinePiecesPerItem: "",
    userId: "",
    vaccineStock: 0,
    totalQuantity: 0,
};

export const inventoryFormData = {
    brandName: '',
    genericName: '',
    stock: 0,
    stockClassification: '',
    piecesPerItem: 0,
    lotNo: '',
    dosage: '',
    type: '',
    packaging: '',
    expirationDate: '',
    regulatoryClassification: '',
    description: ''
};

export const requestFormData = {
    rhuId: "",
    userId: "",
    itemId: "",
    reason: "",
    requestedQuantity: ""
};

export const inventoryFilters = ["All", "Medicines", "Vitamins", "Vaccine"];
export const inventoryTabs = ["Medicine", "Vitamin", "Vaccine"];
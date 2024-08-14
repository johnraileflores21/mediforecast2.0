import React, { createContext, useContext, useState, useEffect } from "react";

type FormData = {
    firstname: string;
    lastname: string;
};

type FormContextType = {
    formData: FormData[];
    addFormData: (data: FormData) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormData = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormData must be used within a FormProvider");
    }
    return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [formData, setFormData] = useState<FormData[]>(() => {
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    const addFormData = (data: FormData) => {
        setFormData((prev) => [...prev, data]);
    };

    return (
        <FormContext.Provider value={{ formData, addFormData }}>
            {children}
        </FormContext.Provider>
    );
};

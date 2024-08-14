import React, { useState } from "react";
import { useFormData } from "./FormContext";

const TryRegister: React.FC = () => {
    const { addFormData } = useFormData();
    const [formData, setFormData] = useState({ firstname: "", lastname: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFormData(formData);
        setFormData({ firstname: "", lastname: "" }); // Clear form after submission
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Firstname"
            />
            <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Lastname"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default TryRegister;

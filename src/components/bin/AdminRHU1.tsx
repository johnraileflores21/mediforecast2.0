import React from "react";
import { useFormData } from "../FormContext";

const AdminRHU1: React.FC = () => {
  const { formData } = useFormData();

  return (
    <div>
      <h2>Submitted Data</h2>
      <table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((data, index) => (
            <tr key={index}>
              <td>{data.firstname}</td>
              <td>{data.lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRHU1;

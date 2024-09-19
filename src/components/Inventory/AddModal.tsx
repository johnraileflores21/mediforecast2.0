import React, { useState } from "react";
import { dosage_forms, inventoryFormData, inventoryTabs, medical_packaging } from "../../assets/common/constants";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab
} from "@mui/material";

import TabPanel from "./TabPanel";

const style: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px 35px',
    outline: 'none',
};

interface ModalParams {
    showModal: boolean;
    closeModal: () => void;
}

const AddItemModal: React.FC<ModalParams> = ({showModal, closeModal}) => {
  const [formData, setFormData] = useState(inventoryFormData);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => closeModal();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    handleClose();
  };

  return (
    <div>

      <Modal open={showModal} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Add {inventoryTabs[tabIndex]}
          </Typography>

          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            {inventoryTabs.map((item, index) => (<Tab label={item} key={index} />))}
          </Tabs>
          <br />
          <form onSubmit={handleSubmit}>
                {[0, 1].map((i) => (
                    <div className="space-y-4">
                        <TabPanel value={tabIndex} index={i} key={i}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField
                                    fullWidth
                                    label="Brand Name"
                                    name="brandName"
                                    value={formData.brandName}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Generic Name"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <TextField
                                    fullWidth
                                    label="Stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Stock Classification"
                                    name="stockClassification"
                                    value={formData.stockClassification}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Piece/s"
                                    name="piecesPerItem"
                                    type="number"
                                    value={formData.piecesPerItem}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField
                                    fullWidth
                                    label="Lot No."
                                    name="lotNo"
                                    value={formData.lotNo}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Dosage"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                    label="Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    >
                                    {dosage_forms.map((item, index) => (
                                        <MenuItem value={item} key={index}>{item}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Packaging</InputLabel>
                                    <Select
                                    label="Packaging"
                                    name="packaging"
                                    value={formData.packaging}
                                    onChange={handleInputChange}
                                    >
                                    {medical_packaging.map((item, index) => (
                                        <MenuItem value={item} key={index}>{item}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField
                                    fullWidth
                                    label="Expiration Date"
                                    name="expirationDate"
                                    type="date"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    value={formData.expirationDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </TabPanel>
                    </div>
                ))}
                
                <div className="space-y-4">
                    <TabPanel value={tabIndex} index={2}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <TextField
                                fullWidth
                                label="Brand Name"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                label="Lot No."
                                name="lotNo"
                                value={formData.lotNo}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                label="Stock Classification"
                                name="stockClassification"
                                value={formData.stockClassification}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                label="Piece/s"
                                name="piecesPerItem"
                                type="number"
                                value={formData.piecesPerItem}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    {dosage_forms.map((item, index) => (
                                        <MenuItem value={item} key={index}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Packaging</InputLabel>
                                <Select
                                label="Packaging"
                                name="packaging"
                                value={formData.packaging}
                                onChange={handleInputChange}
                            >
                                {medical_packaging.map((item, index) => (
                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <TextField
                            fullWidth
                            label="Expiration Date"
                            name="expirationDate"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.expirationDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </TabPanel>
                </div>

          
                <div className="flex justify-end gap-2">
                    <Button variant="contained" color="default" onClick={handleClose} className="mt-4">
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit" className="mt-4">
                        Submit
                    </Button>
                </div>
            </form>

          
        </Box>
      </Modal>
    </div>
  );
};

export default AddItemModal;
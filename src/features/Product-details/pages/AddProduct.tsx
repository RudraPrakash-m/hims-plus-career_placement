import { useState } from 'react';
import { Button, Card, DynamicFormTable, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import addProductConfig from '../form-config/addproduct.json';
import '../styles/addProduct.css';

interface ProductDetail {
  [key: string]: string | number;
}

const AddProduct = () => {
  const config = addProductConfig as {
    appendFields: FormField[];
  };

  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button, this contains the editing record
  const editRecord = location.state?.editRecord;

  // Add stable tempId to rows for React list keys
  const [productDetails, setProductDetails] = useState<ProductDetail[]>(() => {
    if (editRecord) {
      return [{ ...editRecord, tempId: editRecord.id || crypto.randomUUID() }];
    }
    return [
      {
        ...config.appendFields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {} as ProductDetail),
        tempId: crypto.randomUUID(),
      },
    ];
  });

  const methods = useForm({
    defaultValues: {},
    mode: 'onChange',
  });

  const handleSubmit = () => {
    // Validate that required fields in rows are not empty
    const hasInvalidRow = productDetails.some(row => !row.sku || !row.category || !row.purchaseDate || !row.amount);
    if (hasInvalidRow) {
      showToast.error("Please fill in all required fields for each row.");
      return;
    }

    showToast.success(editRecord?.id ? "Product updated successfully!" : "Product saved successfully!");
    navigate("/Product-details-view");
  };

  const handleAddRow = () => {
    if (editRecord?.id) return;

    const newRow = {
      ...config.appendFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {} as ProductDetail),
      tempId: crypto.randomUUID(),
    };
    setProductDetails([...productDetails, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (editRecord?.id) return;
    setProductDetails(productDetails.filter((_, i) => i !== index));
  };

  const handleDetailChange = (
    index: number,
    fieldName: string,
    value: string | number
  ) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [fieldName]: value,
      };
      return updated;
    });
  };

  const headers = config.appendFields.map((field) => field.label || field.name);

  return (
    <div className="space-y-4">
      <PageHeader title={editRecord?.id ? "Edit Product" : "Add Product"} />
      <Card title={editRecord?.id ? `Edit Product - ${editRecord.sku}` : "Add Product"}>
        <FormProvider {...methods}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="add-product-form space-y-6">
            <DynamicFormTable
              rows={productDetails}
              headers={headers}
              onAdd={editRecord?.id ? undefined : handleAddRow}
              onRemove={editRecord?.id ? undefined : handleRemoveRow}
              renderRow={(index) => {
                const row = productDetails[index];
                const rowKey = row.tempId || row.id || String(index);
                return (
                  <>
                    {config.appendFields.map((field) => {
                      const isSelectOrDate = field.type === 'select' || field.type === 'date';
                      const cellKey = isSelectOrDate
                        ? `${rowKey}_${field.name}_${row[field.name] || ''}`
                        : `${rowKey}_${field.name}`;

                      return (
                        <td key={`${rowKey}_${field.name}`} className="p-3 border border-table-border">
                          <FormGenerator
                            key={cellKey}
                            fields={[{ ...field, label: undefined }]}
                            onSubmit={() => { }}
                            gridColumns={1}
                            standalone={true}
                            defaultValues={{
                              [field.name]: row[field.name] || '',
                            }}
                            onValuesChange={(values) => {
                              if (values[field.name] !== undefined) {
                                handleDetailChange(index, field.name, values[field.name]);
                              }
                            }}
                          />
                        </td>
                      );
                    })}
                  </>
                );
              }}
            />

            <div className="flex justify-start items-center gap-2 mt-4">
              <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default AddProduct;

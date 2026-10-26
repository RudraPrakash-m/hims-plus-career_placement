import { useState, useMemo, useCallback } from "react";
import { Card, DataTable, Input, PageHeader, Select, type TableColumnDef } from '@mfe/components';

import tableConfig from "../form-config/editableEmployeeTable.json";

interface EmployeeRow {
    id: string;
    employeeName: string;
    designation: string;
    department: string;
}

interface TableColumnConfig {
    accessorKey: keyof EmployeeRow;
    header: string;
    size?: number;
    editable?: boolean;
    type?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
}

const typedTableConfig = tableConfig as TableColumnConfig[];

const INITIAL_DATA: EmployeeRow[] = [
    { id: "EMP-001", employeeName: "", designation: "", department: "" },
    { id: "EMP-002", employeeName: "", designation: "", department: "" },
    { id: "EMP-003", employeeName: "", designation: "", department: "" },
    { id: "EMP-004", employeeName: "", designation: "", department: "" }
];

const EditableTextCell = ({
    value,
    label,
    placeholder,
    onChange,
}: {
    value: string;
    label: string;
    placeholder?: string;
    onChange: (val: string) => void;
}) => (
    <Input
        value={value}
        aria-label={label}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        wrapperClassName="mb-0 py-1.5"
    />
);

const EditableSelectCell = ({
    value,
    label,
    options,
    onChange,
}: {
    value: string;
    label: string;
    options: { label: string; value: string }[];
    onChange: (val: string) => void;
}) => (
    <Select
        value={value}
        aria-label={label}
        onChange={(value: string | number) => onChange(String(value))}
        options={options}
        wrapperClassName="mb-0 py-1.5"
    />
);

/** Columns come from editableEmployeeTable.json; editable ones render an input or a select in the cell. */
const getEditableColumns = (
    handleFieldChange: (id: string, key: keyof EmployeeRow, val: string) => void
): TableColumnDef<EmployeeRow>[] =>
    typedTableConfig.map((col) => {
        const base: TableColumnDef<EmployeeRow> = {
            id: col.accessorKey,
            header: col.header,
            accessorFn: (row) => row[col.accessorKey],
            enableSorting: !col.editable,
            // Inputs need room: keep the width from the config and don't let them be dragged narrower.
            resizable: !col.editable,
        };
        if (!col.editable) return base;

        if (col.type === "select") {
            return {
                ...base,
                Cell: ({ row: { original: row } }) => (
                    <EditableSelectCell
                        value={row[col.accessorKey] || ""}
                        label={`${col.header} for ${row.id}`}
                        options={col.options || []}
                        onChange={(val) => handleFieldChange(row.id, col.accessorKey, val)}
                    />
                ),
            };
        }
        return {
            ...base,
            Cell: ({ row: { original: row } }) => (
                <EditableTextCell
                    value={row[col.accessorKey] || ""}
                    label={`${col.header} for ${row.id}`}
                    placeholder={col.placeholder}
                    onChange={(val) => handleFieldChange(row.id, col.accessorKey, val)}
                />
            ),
        };
    });

const EditableEmployeeTable = () => {
    const [tableData, setTableData] = useState<EmployeeRow[]>(INITIAL_DATA);

    const handleFieldChange = useCallback((id: string, key: keyof EmployeeRow, val: string) => {
        setTableData((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: val } : row)));
    }, []);

    const columns = useMemo(() => getEditableColumns(handleFieldChange), [handleFieldChange]);

    return (
        <div className="space-y-4">
            <PageHeader 
                title="Editable Employee Registry" 
                description="Inline bulk editing of employee records, designations and departments."
                breadcrumb={[
                    { label: "Employees", path: "/view-employee-details" },
                    { label: "Inline Editor" },
                ]}
            />
            <Card flush>
                <DataTable
                    caption="Quick edit employee list"
                    data={tableData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    searchPlaceholder="Search employees…"
                    exportFileName="employee_quick_edit"
                    zebra={false}
                />
            </Card>
        </div>
    );
};

export default EditableEmployeeTable;

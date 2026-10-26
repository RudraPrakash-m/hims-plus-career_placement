// src/features/doctor-details/pages/DoctorDetailsList.tsx
import React, { useState } from 'react';
import { Badge, Card, DataTable, DialogModal, Modal, PageHeader, showToast, type BadgeVariant, type TableColumnDef } from '@mfe/components';

import type { DoctorDetailsItem } from '../types/doctor-details.types';

/** Status pill (was StatusBadge): colour and label per status. */
const STATUS_PILL: Record<string, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  success: { variant: 'success', label: 'Success' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  warning: { variant: 'warning', label: 'Warning' },
  suspended: { variant: 'danger', label: 'Suspended' },
  error: { variant: 'danger', label: 'Error' },
  info: { variant: 'info', label: 'Info' },
};
const StatusPill = ({ status, label }: { status: string; label?: string }) => {
  const pill = STATUS_PILL[status] ?? { variant: 'outline' as BadgeVariant, label: status };
  return (
    <Badge variant={pill.variant} size="sm">
      {label ?? pill.label}
    </Badge>
  );
};

const INITIAL_DATA: DoctorDetailsItem[] = [
  { id: '1', name: 'DoctorDetails Alpha', code: 'DOC-001', status: 'active' },
  { id: '2', name: 'DoctorDetails Beta', code: 'DOC-002', status: 'active' },
  { id: '3', name: 'DoctorDetails Gamma', code: 'DOC-003', status: 'inactive' },
];

const DoctorStatus: React.FC<{ status?: string }> = ({ status }) => (
  <StatusPill status={status?.toLowerCase() === 'active' ? 'active' : 'inactive'} />
);

const COLUMNS: TableColumnDef<DoctorDetailsItem>[] = [
  { id: 'code', header: 'Doctor Code', accessorFn: (d) => d.code, Cell: ({ row: { original: d } }) => <span className="font-semibold text-xs text-foreground">{d.code}</span>, enableSorting: true, size: 128, },
  { id: 'name', header: 'Doctor Name', accessorFn: (d) => d.name, Cell: ({ row: { original: d } }) => <div className="font-medium text-foreground max-w-[200px] truncate">{d.name}</div>, enableSorting: true },
  { id: 'status', header: 'Status', accessorFn: (d) => d.status, Cell: ({ row: { original: d } }) => <DoctorStatus status={d.status} />, enableSorting: true },
  { id: 'id', header: 'Internal ID', accessorFn: (d) => d.id, defaultHidden: true },
];

export const DoctorDetailsList: React.FC = () => {
  const [data, setData] = useState<DoctorDetailsItem[]>(INITIAL_DATA);
  const [selectedItem, setSelectedItem] = useState<DoctorDetailsItem | null>(null);
  const [toDelete, setToDelete] = useState<DoctorDetailsItem | null>(null);

  const confirmDelete = () => {
    if (!toDelete) return;
    setData((prev) => prev.filter((d) => d.id !== toDelete.id));
    showToast.success(`${toDelete.name} deleted`);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader 
        title="Doctor Directory" 
        description="Medical practitioners, specialization codes and practice availability."
        breadcrumb={[
          { label: "Administration" },
          { label: "Doctor Details" },
        ]} 
      />

      <Card flush>
        <DataTable
          caption="Doctor details"
          data={data}
          columns={COLUMNS}
          getRowId={(d) => String(d.id)}
          rowLabel={(d) => d.name}
          searchPlaceholder="Search by name or code…"
          exportFileName="doctor-details_records"
          actions={{
            onView: setSelectedItem,
            onDelete: setToDelete,
          }}
          emptyTitle="No doctor details yet"
        />
      </Card>

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? `DoctorDetails Details - ${selectedItem.name}` : 'DoctorDetails Details'}
        size="2xl"
      >
        {selectedItem && (
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ['ID', String(selectedItem.id)],
              ['DoctorDetails Name', selectedItem.name],
              ['Code', selectedItem.code],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-border pb-2">
                <dt className="text-xs font-semibold uppercase text-muted">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
            <div className="border-b border-border pb-2">
              <dt className="text-xs font-semibold uppercase text-muted">Status</dt>
              <dd className="mt-1"><DoctorStatus status={selectedItem.status} /></dd>
            </div>
          </dl>
        )}
      </Modal>

      <DialogModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        type="danger"
        title="Delete record?"
        message={toDelete ? `${toDelete.name} (${toDelete.code}) will be removed. This cannot be undone.` : ''}
        confirmText="Delete"
      />
    </>
  );
};

export default DoctorDetailsList;

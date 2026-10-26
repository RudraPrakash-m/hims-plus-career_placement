import { useMemo, useState, useCallback } from 'react';
import { Badge, Button, Card, DataTable, Modal, PageHeader, Select, showToast, useAppNavigate, type BadgeVariant, type TableColumnDef } from '@mfe/components';
import { Plus, Lock, Unlock, CheckCircle2, XCircle } from 'lucide-react';

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

interface ProductData {
    id: string;
    sku: string;
    category: string;
    purchaseDate: string;
    amount: number;
    status: 'Active' | 'Inactive';
}

const INITIAL_PRODUCTS: ProductData[] = [
    { id: '1', sku: 'SKU-ELEC-001', category: 'Electronics', purchaseDate: '2024-01-15', amount: 25999, status: 'Active' },
    { id: '2', sku: 'SKU-FURN-002', category: 'Furniture', purchaseDate: '2024-02-20', amount: 14500, status: 'Active' },
    { id: '3', sku: 'SKU-STAT-003', category: 'Stationery', purchaseDate: '2024-03-10', amount: 3200, status: 'Inactive' },
    { id: '4', sku: 'SKU-APPL-004', category: 'Appliances', purchaseDate: '2024-04-05', amount: 48900, status: 'Active' },
    { id: '5', sku: 'SKU-IT-005', category: 'IT Equipment', purchaseDate: '2024-05-18', amount: 85000, status: 'Active' },
];

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : 'N/A');
const formatAmount = (value: number) => `₹${Number(value || 0).toLocaleString()}`;

const ProductStatus = ({ status }: { status: ProductData['status'] }) => (
    <StatusPill status={status === 'Active' ? 'active' : 'inactive'} />
);

const PRODUCT_COLUMNS: TableColumnDef<ProductData>[] = [
    { id: 'sku', header: 'SKU Code', accessorFn: (p) => p.sku, Cell: ({ row: { original: p } }) => <span className="font-semibold text-xs text-foreground">{p.sku}</span>, enableSorting: true },
    { id: 'category', header: 'Category', accessorFn: (p) => p.category, Cell: ({ row: { original: p } }) => <span className="text-muted text-xs">{p.category}</span>, enableSorting: true },
    { id: 'amount', header: 'Amount', accessorFn: (p) => p.amount, Cell: ({ row: { original: p } }) => <span className="font-bold text-xs text-foreground">{formatAmount(p.amount)}</span>, enableSorting: true, align: 'right' },
    { id: 'status', header: 'Status', accessorFn: (p) => p.status, Cell: ({ row: { original: p } }) => <ProductStatus status={p.status} />, enableSorting: true },
    { id: 'purchaseDate', header: 'Purchase Date', accessorFn: (p) => p.purchaseDate, Cell: ({ row: { original: p } }) => formatDate(p.purchaseDate), defaultHidden: true },
];

interface ProductFilters {
    category: string;
    status: string;
}

const EMPTY_FILTERS: ProductFilters = { category: '', status: '' };

const STATUS_OPTIONS = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const ProductView = () => {
    const navigate = useAppNavigate();
    const [products, setProducts] = useState<ProductData[]>(INITIAL_PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [selection, setSelection] = useState<string[]>([]);

    // Filter form (draft) vs. filters applied to the table.
    const [draft, setDraft] = useState<ProductFilters>(EMPTY_FILTERS);
    const [applied, setApplied] = useState<ProductFilters>(EMPTY_FILTERS);
    const [filtersHidden, setFiltersHidden] = useState(false);
    const appliedCount = Object.values(applied).filter(Boolean).length;

    const categoryOptions = useMemo(
        () => [...new Set(products.map((p) => p.category))].sort().map((c) => ({ value: c, label: c })),
        [products],
    );

    const rows = useMemo(
        () => products.filter((p) => (!applied.category || p.category === applied.category) && (!applied.status || p.status === applied.status)),
        [products, applied],
    );

    const setStatus = useCallback((ids: string[], status: ProductData['status']) => {
        setProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p)));
        showToast.success(ids.length > 1 ? `${ids.length} products set to ${status}` : `Product status changed to ${status}`);
    }, []);

    const resetFilters = () => {
        setDraft(EMPTY_FILTERS);
        setApplied(EMPTY_FILTERS);
    };

    return (
        <>
            <PageHeader
                title="Product Inventory"
                description="Catalogue items, inventory SKU details and procurement amounts."
                breadcrumb={[
                    { label: "Inventory" },
                    { label: "Products" },
                ]}
                actions={<Button icon={<Plus size={16} />} onClick={() => navigate("/Product-details")}>Add Product</Button>}
            />

            <div className="space-y-4">
                {!filtersHidden && (
                  <Card title="Filters" description={appliedCount ? `${appliedCount} applied` : undefined}>
                    <form
                      className="flex flex-wrap items-end gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setApplied(draft);
                      }}
                    >
                    <Select
                        label="Category"
                        placeholder="All categories"
                        options={categoryOptions}
                        value={draft.category}
                        onChange={(value: string | number) => setDraft((d) => ({ ...d, category: String(value) }))}
                        wrapperClassName="min-w-48 flex-1 max-w-xs"
                    />
                    <Select
                        label="Status"
                        placeholder="All statuses"
                        options={STATUS_OPTIONS}
                        value={draft.status}
                        onChange={(value: string | number) => setDraft((d) => ({ ...d, status: String(value) }))}
                        wrapperClassName="min-w-48 flex-1 max-w-xs"
                    />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">Apply</Button>
                        <Button type="button" size="sm" action="reset" onClick={resetFilters} />
                      </div>
                    </form>
                  </Card>
                )}

                <Card flush>
                    <DataTable
                        caption="Products"
                        data={rows}
                        columns={PRODUCT_COLUMNS}
                        getRowId={(p) => p.id}
                        rowLabel={(p) => p.sku}
                        searchPlaceholder="Search by SKU or category…"
                        exportFileName="product_records"
                        selectable={false}
                        selectedKeys={selection}
                        onSelectionChange={setSelection}
                        bulkActions={[
                            { id: 'activate', label: 'Activate', icon: CheckCircle2, onClick: (ids) => { setStatus(ids, 'Active'); setSelection([]); } },
                            { id: 'deactivate', label: 'Deactivate', icon: XCircle, danger: true, onClick: (ids) => { setStatus(ids, 'Inactive'); setSelection([]); } },
                        ]}
                        filterToggle={{ hidden: filtersHidden, onToggle: () => setFiltersHidden((h) => !h), appliedCount }}
                        extraViewState={{
                            get: () => applied,
                            apply: (v) => {
                                setApplied(v as ProductFilters);
                                setDraft(v as ProductFilters);
                            },
                        }}
                        actions={{
                            onView: setSelectedProduct,
                            onEdit: (p) => navigate('/Product-details', { state: { editRecord: p } }),
                            more: (p) => [
                                p.status === 'Active'
                                    ? { id: 'lock', label: 'Deactivate', icon: Lock, danger: true, onSelect: () => setStatus([p.id], 'Inactive') }
                                    : { id: 'unlock', label: 'Activate', icon: Unlock, onSelect: () => setStatus([p.id], 'Active') },
                            ],
                        }}
                        emptyTitle="No products yet"
                        emptyAction={<Button icon={<Plus size={16} />} onClick={() => navigate("/Product-details")}>Add Product</Button>}
                    />
                </Card>
            </div>

            <Modal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                title={selectedProduct ? `Product Details - ${selectedProduct.sku}` : 'Product Details'}
                size="xl"
            >
                {selectedProduct && (
                    <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                            ['SKU', selectedProduct.sku],
                            ['Category', selectedProduct.category],
                            ['Purchase Date', formatDate(selectedProduct.purchaseDate)],
                            ['Amount', formatAmount(selectedProduct.amount)],
                        ].map(([k, v]) => (
                            <div key={k} className="border-b border-border pb-2">
                                <dt className="text-xs font-semibold uppercase text-muted">{k}</dt>
                                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
                            </div>
                        ))}
                        <div className="border-b border-border pb-2">
                            <dt className="text-xs font-semibold uppercase text-muted">Status</dt>
                            <dd className="mt-1"><ProductStatus status={selectedProduct.status} /></dd>
                        </div>
                    </dl>
                )}
            </Modal>
        </>
    );
};

export default ProductView;

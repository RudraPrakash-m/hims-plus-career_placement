import { useMemo, useState } from 'react';
import { Badge, Card, DataTable, PageHeader, showToast, Tabs, type TabItem, type TableBulkAction, type TableColumnDef } from '@mfe/components';
import { FileText, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

type Stage = 'draft' | 'approved' | 'rejected';

interface ProductData {
    id: string;
    sku: string;
    category: string;
    purchaseDate: string;
    amount: number;
    stage: Stage;
}

const INITIAL_PRODUCTS: ProductData[] = [
    { id: '1', sku: 'SKU001', category: 'Electronics', purchaseDate: '2024-01-15', amount: 5000, stage: 'draft' },
    { id: '2', sku: 'SKU002', category: 'Clothing', purchaseDate: '2024-02-20', amount: 1500, stage: 'draft' },
    { id: '3', sku: 'SKU003', category: 'Home & Garden', purchaseDate: '2024-03-10', amount: 3000, stage: 'approved' },
    { id: '4', sku: 'SKU004', category: 'Sports', purchaseDate: '2024-04-05', amount: 2500, stage: 'approved' },
    { id: '5', sku: 'SKU005', category: 'Electronics', purchaseDate: '2024-05-12', amount: 4500, stage: 'approved' },
    { id: '6', sku: 'SKU006', category: 'Books', purchaseDate: '2024-06-01', amount: 800, stage: 'rejected' },
    { id: '7', sku: 'SKU007', category: 'Clothing', purchaseDate: '2024-06-15', amount: 1200, stage: 'rejected' },
];

const STAGE_TABS: { key: Stage; label: string; icon: TabItem['icon'] }[] = [
    { key: 'draft', label: 'Draft', icon: FileText },
    { key: 'approved', label: 'Approved', icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
];

const STAGE_BADGE: Record<Stage, { tone: 'warning' | 'success' | 'danger'; label: string }> = {
    draft: { tone: 'warning', label: 'Draft' },
    approved: { tone: 'success', label: 'Approved' },
    rejected: { tone: 'danger', label: 'Rejected' },
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const formatAmount = (value: number) => `₹${value.toLocaleString()}`;

const PRODUCT_TAB_COLUMNS: TableColumnDef<ProductData>[] = [
    { id: 'sku', header: 'SKU Code', accessorFn: (p) => p.sku, Cell: ({ row: { original: p } }) => <span className="font-semibold text-xs text-foreground">{p.sku}</span>, enableSorting: true },
    { id: 'category', header: 'Category', accessorFn: (p) => p.category, Cell: ({ row: { original: p } }) => <span className="text-muted text-xs">{p.category}</span>, enableSorting: true },
    { id: 'amount', header: 'Amount', accessorFn: (p) => p.amount, Cell: ({ row: { original: p } }) => <span className="font-bold text-xs text-foreground">{formatAmount(p.amount)}</span>, enableSorting: true, align: 'right' },
    { id: 'purchaseDate', header: 'Purchase Date', accessorFn: (p) => p.purchaseDate, Cell: ({ row: { original: p } }) => formatDate(p.purchaseDate), defaultHidden: true },
];

const ProductTabs = () => {
    const [products, setProducts] = useState<ProductData[]>(INITIAL_PRODUCTS);
    const [activeTab, setActiveTab] = useState<string>('draft');
    const [selection, setSelection] = useState<string[]>([]);
    const stage = activeTab as Stage;

    const tabs: TabItem[] = STAGE_TABS.map((t) => ({ ...t, count: products.filter((p) => p.stage === t.key).length }));
    const rows = useMemo(() => products.filter((p) => p.stage === stage), [products, stage]);

    const moveTo = (ids: string[], next: Stage) => {
        setProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, stage: next } : p)));
        setSelection([]);
        const what = ids.length > 1 ? `${ids.length} products` : 'Product';
        showToast.success(`${what} moved to ${STAGE_BADGE[next].label}`);
    };

    const bulkActions: TableBulkAction[] =
        stage === 'draft'
            ? [
                  { id: 'approve', label: 'Approve', icon: CheckCircle, onClick: (ids) => moveTo(ids, 'approved') },
                  { id: 'reject', label: 'Reject', icon: XCircle, danger: true, onClick: (ids) => moveTo(ids, 'rejected') },
              ]
            : [{ id: 'draft', label: 'Move to draft', icon: RotateCcw, onClick: (ids) => moveTo(ids, 'draft') }];

    return (
        <>
            <PageHeader 
                title="Product Approval Stages" 
                description="Review product lifecycle stages from draft through approval and rejection."
                breadcrumb={[
                    { label: "Inventory", path: "/view-Product" },
                    { label: "Product Approvals" },
                ]}
            />

            <div className="space-y-4">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setSelection([]);
                    }}
                    label="Product stage"
                    idPrefix="product-stage"
                />

                <Card flush>
                    <DataTable
                        key={stage}
                        caption={`${STAGE_BADGE[stage].label} products`}
                        viewsKey="approve-products"
                        data={rows}
                        columns={PRODUCT_TAB_COLUMNS}
                        getRowId={(p) => p.id}
                        rowLabel={(p) => p.sku}
                        searchPlaceholder="Search by SKU or category…"
                        exportFileName={`products_${stage}`}
                        selectable={false}
                        selectedKeys={selection}
                        onSelectionChange={setSelection}
                        bulkActions={bulkActions}
                        actions={{
                            more: (p) =>
                                p.stage === 'draft'
                                    ? [
                                          { id: 'approve', label: 'Approve', icon: CheckCircle, onSelect: () => moveTo([p.id], 'approved') },
                                          { id: 'reject', label: 'Reject', icon: XCircle, danger: true, onSelect: () => moveTo([p.id], 'rejected') },
                                      ]
                                    : [{ id: 'draft', label: 'Move to draft', icon: RotateCcw, onSelect: () => moveTo([p.id], 'draft') }],
                        }}
                        previewTitle={(p) => p.sku}
                        renderPreview={(p) => (
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                {[
                                    ['SKU', p.sku],
                                    ['Category', p.category],
                                    ['Purchase Date', formatDate(p.purchaseDate)],
                                    ['Amount', formatAmount(p.amount)],
                                ].map(([k, v]) => (
                                    <div key={k}>
                                        <dt className="text-xs text-muted">{k}</dt>
                                        <dd className="font-medium text-foreground">{v}</dd>
                                    </div>
                                ))}
                                <div className="col-span-2">
                                    <dt className="text-xs text-muted">Stage</dt>
                                    <dd className="mt-1"><Badge variant={STAGE_BADGE[p.stage].tone} size="sm">{STAGE_BADGE[p.stage].label}</Badge></dd>
                                </div>
                            </dl>
                        )}
                        emptyTitle={`No ${STAGE_BADGE[stage].label.toLowerCase()} products`}
                        emptyDescription="Products move between Draft, Approved and Rejected from the row menu."
                    />
                </Card>
            </div>
        </>
    );
};

export default ProductTabs;

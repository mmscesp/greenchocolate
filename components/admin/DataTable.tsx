import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any) => React.ReactNode;
}

export interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onAction?: (row: any, action: string) => void;
  actions?: { label: string; value: string; color?: string }[];
}

export function DataTable({ columns, data, title, onEdit, onDelete, onAction, actions }: DataTableProps) {
  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th key={col.key} className={`text-left py-3 px-4 font-semibold text-sm text-gray-600 ${col.width || ''}`}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || onAction || actions) && <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onAction || actions) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {actions &&
                        actions.map((action) => (
                          <Button
                            key={action.value}
                            variant="outline"
                            size="sm"
                            onClick={() => onAction?.(row, action.value)}
                            className={`text-xs ${action.color || ''}`}
                          >
                            {action.label}
                          </Button>
                        ))}
                      {!actions && (
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

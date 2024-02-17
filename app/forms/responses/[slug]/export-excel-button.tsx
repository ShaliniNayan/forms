'user client';

import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/exportToExcel';

type formattedResponse = {
  [key: string]: string;
};

export function ExportToExcelButton({
  processedData,
}: {
  processedData: (string | number)[][];
}) {
  return (
    <Button onClick={() => exportToExcel(processedData, 'MyData')}>
      Export to Excel
    </Button>
  );
}

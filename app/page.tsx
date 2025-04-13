'use client';

import { useEffect, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

type CSVRow = {
  [key: string]: string;
};

export default function HomePage() {
  const [data, setData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const res = await fetch('/Table_1.csv');
      const text = await res.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<CSVRow>) => {
          setHeaders(results.meta.fields || []);
          setData(results.data as CSVRow[]);
        },
      });
    };

    fetchCSV();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSV Table Display</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

type CSVRow = {
  [key: string]: string;
};

export default function HomePage() {
  const [table1, setTable1] = useState<CSVRow[]>([]);
  const [headers1, setHeaders1] = useState<string[]>([]);

  const [table2, setTable2] = useState<CSVRow[]>([]);
  const [headers2, setHeaders2] = useState<string[]>([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const res1 = await fetch("/Table_1.csv");
      const text1 = await res1.text();
      const res2 = await fetch("/Table_2.csv");
      const text2 = await res2.text();

      // Load Table 1
      const parsed1 = Papa.parse(text1, {
        header: true,
        skipEmptyLines: true,
      });

      let data1 = parsed1.data as CSVRow[];
      setHeaders1(parsed1.meta.fields || []);
      setTable1(data1);

      // Load Table 2
      const parsed2 = Papa.parse(text2, {
        header: true,
        skipEmptyLines: true,
      });
      let data2 = parsed2.data as CSVRow[];

      setHeaders2(parsed2.meta.fields || []);
      setTable2(data2);

      // Find value from Table 1 where "Index #" is "A5"
      const a5 = data1.find((row) => row["Index #"] === "A5");
      const a20 = data1.find((row) => row["Index #"] === "A20");
      const a7 = data1.find((row) => row["Index #"] === "A7");
      const a12 = data1.find((row) => row["Index #"] === "A12");
      const a13 = data1.find((row) => row["Index #"] === "A13");
      const a15 = data1.find((row) => row["Index #"] === "A15");
      const alphaValue =
        (parseInt(a5!.Value, 10) + parseInt(a20!.Value, 10)).toString() ?? "0";
      const betaValue =
        (parseInt(a15!.Value, 10) / parseInt(a7!.Value, 10)).toString() ?? "0";
      const charlieValue =
        (parseInt(a13!.Value, 10) * parseInt(a12!.Value, 10)).toString() ?? "0";

      // Update Table 2, where Category === "Alpha"
      for (let i = 0; i < data2.length; i++) {
        if (data2[i].Category === "Alpha") {
          data2[i].Value = alphaValue;
        }

        if (data2[i].Category === "Beta") {
          data2[i].Value = betaValue;
        }

        if (data2[i].Category === "Charlie") {
          data2[i].Value = charlieValue;
        }
      }

      console.log("Table 2 after update:", data2);

      setTable2([...data2]);
    };

    fetchCSV();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSV Table Display</h1>
      <h2 className="text-xl font-bold mb-4">Table 1</h2>
      <div className="overflow-x-auto mb-6">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              {headers1.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table1.map((row, i) => (
              <tr key={i}>
                {headers1.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {row[header]} {/* Display the updated value */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-bold mb-4">Table 2</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              {headers2.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table2.map((row, i) => (
              <tr key={i}>
                {headers2.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {row[header]} {/* Display the updated value */}
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

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const labData = {
  "Complete Blood Count (CBC)": [
    { test: "White Blood Cell (WBC)", value: "4.5-11.0 x 10^9/L" },
    { test: "Red Blood Cell (RBC)", value: "Male: 4.7-6.1, Female: 4.2-5.4 x 10^12/L" },
    { test: "Hemoglobin (Hgb)", value: "Male: 13.8-17.2, Female: 12.1-15.1 g/dL" },
    { test: "Hematocrit (Hct)", value: "Male: 40.7-50.3, Female: 36.1-44.3 %" },
    { test: "Platelets (PLT)", value: "150-450 x 10^9/L" },
  ],
  "Kidney Function Tests (KFT/Renal Panel)": [
    { test: "Blood Urea Nitrogen (BUN)", value: "7-20 mg/dL" },
    { test: "Creatinine", value: "Male: 0.74-1.35, Female: 0.59-1.04 mg/dL" },
    { test: "Sodium (Na)", value: "135-145 mEq/L" },
    { test: "Potassium (K)", value: "3.5-5.2 mEq/L" },
    { test: "Chloride (Cl)", value: "96-106 mEq/L" },
    { test: "Bicarbonate (HCO3)", value: "22-29 mEq/L" },
  ],
  "Liver Function Tests (LFT/Hepatic Panel)": [
    { test: "Alanine Aminotransferase (ALT)", value: "7-55 U/L" },
    { test: "Aspartate Aminotransferase (AST)", value: "8-48 U/L" },
    { test: "Alkaline Phosphatase (ALP)", value: "40-129 U/L" },
    { test: "Total Bilirubin", value: "0.1-1.2 mg/dL" },
    { test: "Direct Bilirubin", value: "0.0-0.3 mg/dL" },
    { test: "Total Protein", value: "6.0-8.3 g/dL" },
    { test: "Albumin", value: "3.4-5.4 g/dL" },
  ],
  "Lipid Panel": [
    { test: "Total Cholesterol", value: "<200 mg/dL (desirable)" },
    { test: "Triglycerides", value: "<150 mg/dL (desirable)" },
    { test: "HDL Cholesterol", value: ">40 mg/dL (Male), >50 mg/dL (Female)" },
    { test: "LDL Cholesterol", value: "<100 mg/dL (optimal)" },
  ],
};


export function LabRanges() {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(labData).map(([panel, tests]) => (
          <AccordionItem value={panel} key={panel}>
            <AccordionTrigger className="text-xl font-headline">{panel}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Normal Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.test}>
                      <TableCell className="font-medium">{test.test}</TableCell>
                      <TableCell>{test.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

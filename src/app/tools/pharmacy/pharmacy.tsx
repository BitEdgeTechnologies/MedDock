"use client";

import React, { useState, useMemo } from 'react';
import { drugData } from '@/lib/pharmacy-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';

export function Pharmacy() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrugs = useMemo(() => {
    if (!searchTerm) return drugData;
    return drugData.filter(drug =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="mt-8 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by drug name or category..."
          className="w-full pl-10 py-5"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {filteredDrugs.map(drug => (
          <Card key={drug.name}>
            <AccordionItem value={drug.name} className="border-b-0">
              <AccordionTrigger className="p-6 text-left">
                <div className="w-full">
                    <CardTitle>{drug.name}</CardTitle>
                    <CardDescription>{drug.category}</CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                <div>
                    <h4 className="font-semibold mb-1">Common Uses:</h4>
                    <p className="text-muted-foreground">{drug.uses}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Common Side Effects:</h4>
                    <p className="text-muted-foreground">{drug.sideEffects}</p>
                </div>
                 <div>
                    <h4 className="font-semibold mb-1">Important Considerations:</h4>
                    <p className="text-muted-foreground">{drug.considerations}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
      
      {filteredDrugs.length === 0 && (
        <p className="text-center text-muted-foreground">No medications found matching your search.</p>
      )}

    </div>
  );
}

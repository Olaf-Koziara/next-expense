"use client";

import React, { useState } from "react";
import { Service } from "@/types/Service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTableEditField from "./DataTableEditField";
import { useWallet } from "@/features/wallet/context/WalletContext";
import { Schema } from "./types";

type Props<TData> = {
  service: Service<TData>;
  schema: Schema;
  dataParentId?: string | null;
  onSuccess?: () => void;
};

export function DataTableForm<TData>({
  service,
  schema,
  dataParentId,
  onSuccess,
}: Props<TData>) {
  const [formData, setFormData] = useState<Partial<TData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefetch } = useWallet();

  const handleInputChange = (key: string, value: TData[keyof TData]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await service.add(formData as TData, dataParentId);
      const emptyForm = {};
      Object.keys(schema).forEach((key) => {
        if (schema[key].editable) {
          const empty = {
            [key]: getEmptyValue(schema[key].type) as TData[keyof TData],
          };
          Object.assign(emptyForm, empty);
        }
      }, {} as Partial<TData>);
      setFormData(emptyForm);
      triggerRefetch();
      onSuccess?.();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="my-4">
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 gap-3 flex justify-center items-end"
        >
          {Object.entries(schema).map(
            ([key, field]) =>
              field.editable && (
                <div key={key} className="space-y-2">
                  <DataTableEditField
                    column={{
                      columnDef: {
                        id: key,
                        meta: {
                          fieldVariant: field.type,
                          filterOptions: field.options,
                        },
                      },
                    }}
                    placeholder={field.label}
                    value={formData[key as keyof TData]}
                    onChange={(value: TData[keyof TData]) =>
                      handleInputChange(key, value as TData[keyof TData])
                    }
                  />
                </div>
              )
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function getEmptyValue(type: string) {
  if (type === "number") return 0;
  if (type === "select") return undefined;
  if (type === "date") return undefined;
  if (type === "currency") return "";
  if (type === "text") return "";
  return "";
}

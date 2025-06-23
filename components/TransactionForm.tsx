"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import useCategories from "@/hooks/useCategories";
import { transactionSchema, TransactionFormData } from "@/utils/validation";

interface TransactionFormProps {
  type: "expense" | "income";
  onFormSubmitted?: () => void;
  className?: string;
  showBorder?: boolean;
}

export const TransactionForm = ({
  type,
  onFormSubmitted = () => {},
  className = "",
  showBorder = true,
}: TransactionFormProps) => {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      title: "",
      amount: 0,
      category: "",
      currency: "USD",
    },
  });
  const { categories, addCategory } = useCategories(type);
  const { addIncome, addExpense, selectedWallet } = useWallet();
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      form.setValue("category", newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const onSubmit: SubmitHandler<TransactionFormData> = async (data, event) => {
    console.log("Form data:", data);
    console.log("Form errors:", form.formState.errors);

    const formData = {
      ...data,
      currency: selectedWallet?.currency || "USD",
    };

    if (type === "expense") {
      await addExpense(formData);
    } else {
      await addIncome(formData);
    }

    form.reset();
    onFormSubmitted?.();
  };

  const containerClassName = showBorder
    ? `border-2 border-gray-600 rounded-md p-2 h-full ${className}`
    : className;

  return (
    <div className={containerClassName}>
      <Form {...form}>
        <form className="flex gap-1" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    mode="single"
                    formatValueToString={false}
                    dateFormat="dd-MM-yyyy"
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    error={form.formState.errors.date}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Input
            error={form.formState.errors.title}
            placeholder="Title"
            {...form.register("title", { required: true })}
          />
          <Input
            error={form.formState.errors.amount}
            type="number"
            placeholder="Amount"
            {...form.register("amount", { required: true })}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select
                    key={field.value}
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div>
                      {form.formState.errors.category && (
                        <span className="error-message absolute -translate-y-full top-0 text-red-600 text-sm">
                          {form.formState.errors.category.message}
                        </span>
                      )}
                      <SelectTrigger
                        ref={field.ref}
                        aria-invalid={fieldState["invalid"]}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectGroup key="category-group">
                        {categories.map((category) => (
                          <SelectItem
                            key={`category-${category.name}`}
                            value={category.name}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                        <div key="add-category" className="px-2 py-1.5">
                          {isAddingCategory ? (
                            <div className="flex gap-1">
                              <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New category name"
                                className="h-8"
                                autoFocus
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddCategory}
                                className="h-8"
                              >
                                Add
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => setIsAddingCategory(true)}
                            >
                              <PlusCircle size={16} />
                              Add new category
                            </Button>
                          )}
                        </div>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Add {type}</Button>
        </form>
      </Form>
    </div>
  );
};

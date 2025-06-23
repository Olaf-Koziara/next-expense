"use client";
import { CategoryForm } from "@/components/CategoryForm";

interface CategoryFormProps {
  type: "expense" | "income";
  onSubmit?: (name: string) => void;
}

const CategoryFormComponent = ({ type, onSubmit }: CategoryFormProps) => {
  return <CategoryForm type={type} onSubmit={onSubmit} />;
};

export default CategoryFormComponent;

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  type: "expense" | "income";
  onSubmit?: (name: string) => void;
  className?: string;
}

export const CategoryForm = ({
  type,
  onSubmit,
  className = "",
}: CategoryFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (onSubmit) onSubmit(name);
      setName("");
    } catch (error) {
      console.error(`Failed to create ${type} category:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          wrapperClassName="flex-1"
          className="w-full"
          type="text"
          id="name"
          placeholder={`${
            type.charAt(0).toUpperCase() + type.slice(1)
          } Category Name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">
          Add {type.charAt(0).toUpperCase() + type.slice(1)} Category
        </Button>
      </div>
    </form>
  );
};

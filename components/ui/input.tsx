import * as React from "react"

import {cn} from "@/lib/utils"
import {FieldError} from "react-hook-form";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: FieldError,wrapperClassName?: string }>(
    ({className, error, type, wrapperClassName, ...props}, ref) => {
        return (
            <div className={wrapperClassName}>
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <span
                    className="error-message absolute -translate-y-full top-0 text-red-600 text-sm">{error.message}</span>}
            </div>
        )
    }
)
Input.displayName = "Input"

export {Input}

'use client';

import React, {useState} from "react";
import {Input} from "@/components/ui/input"; // Assuming Input handles error styling internally (e.g., border color via aria-invalid)
import {Button} from "@/components/ui/button";
import {signUpWithCredentials} from "@/actions/auth.actions";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import ErrorAlert from "@/components/ui/errorAlert";

// Define the validation schema
const signUpSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

// Infer the type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });
    const [error, setError] = useState<string | null>(null)

    const router = useRouter();

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithCredentials(data);
            if (result.success) {
                router.push('/');
            } else {
                setError(result.message);
            }
        } catch (error) {
            // Optionally: Add error feedback to the user here (e.g., using react-toastify or a state variable)
            console.error("Sign up failed:", error);
            // You might want to set a general form error state here
        }
    };

    return (
        // Use space-y-4 for consistent vertical spacing between form elements
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
                <Input
                    id="name"
                    // Show error message in placeholder if error exists, otherwise show default placeholder
                    placeholder={errors.name ? errors.name.message : "Your Name"}
                    {...register('name')}
                    aria-invalid={errors.name ? "true" : "false"} // Accessibility & potential styling hook
                    // Add specific error class if needed, though aria-invalid might suffice with shadcn/ui
                    className={errors.name ? "placeholder:text-destructive/80" : ""} // Style placeholder text color for errors
                />
                {/* Error message below input is removed */}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
                <Input
                    id="email"
                    type="email"
                    // Show error message in placeholder if error exists, otherwise show default placeholder
                    placeholder={errors.email ? errors.email.message : "name@example.com"}
                    {...register('email')}
                    aria-invalid={errors.email ? "true" : "false"}
                    className={errors.email ? "placeholder:text-destructive/80" : ""}
                />
                {/* Error message below input is removed */}
            </div>


            <div className="space-y-1">
                <Input
                    id="password"
                    type="password"
                    // Show error message in placeholder if error exists, otherwise show default placeholder
                    placeholder={errors.password ? errors.password.message : "********"}
                    {...register('password')}
                    aria-invalid={errors.password ? "true" : "false"}
                    className={errors.password ? "placeholder:text-destructive/80" : ""}
                />
            </div>
            {error && <ErrorAlert message={error}/>}


            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
};

export default SignUpForm;
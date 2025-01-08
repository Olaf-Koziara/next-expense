import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

const ErrorAlert = ({message}: { message: string }) => {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
import {AdapterUser} from "@auth/core/adapters";
import {DefaultJWT} from "@auth/core/jwt";

declare module "next-auth" {


    interface Session {
        user: AdapterUser & {
            provider?: string;  // Add provider to Session's user object
        };
    }

}
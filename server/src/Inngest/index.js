import { onCreateChat } from "./functions/on-chatCreate.js";
import { onUserSignUp } from "./functions/on-signup.js";

const inngestFunctions = [onUserSignUp, onCreateChat];
export { inngestFunctions };

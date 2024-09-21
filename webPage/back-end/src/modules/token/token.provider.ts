import { TOKEN_REPOSITORY } from "../../core/constants";
import { Token } from "./token.entity";

export const tokenProviders = [{
    provide: TOKEN_REPOSITORY,
    useValue: Token,
}];
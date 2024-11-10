"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validate_pipes_1 = require("./core/pipes/validate.pipes");
const cookieParser = require("cookie-parser");
const database_config_1 = require("./core/database/database.config");
const port = process.env.PORT;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const prefix = database_config_1.databaseConfig.urlDatabase;
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(new validate_pipes_1.ValidateInputPipe());
    app.use(cookieParser());
    await app.listen(port);
    console.log('env:', prefix);
    console.log('Listening on port', port);
}
bootstrap();
//# sourceMappingURL=main.js.map
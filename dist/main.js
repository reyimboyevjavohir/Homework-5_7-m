"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('Auth (register, verify, login), Article (CRUD + file upload), Guards, Roles, Interceptors, Filters')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const PORT = process.env.PORT ?? 4001;
    await app.listen(PORT, () => {
        logger.log(`Root api for project: http://localhost:${PORT}`);
        logger.log(`Root api for swagger: http://localhost:${PORT}/docs`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map
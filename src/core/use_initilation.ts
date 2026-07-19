import { ValidationPipe, INestApplication } from "@nestjs/common";
import { } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MulterValidationExceptionFilter } from "./error/validation.filter";
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'; // Import SwaggerTheme
import * as cookieParser from 'cookie-parser';
import { DeviceMiddleware } from "src/global/middlewares/device.middleware";

export const initGlobalApp = (app: INestApplication) => {
    const config = new DocumentBuilder().setTitle("Edfix Clone").build()
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }))
    
    app.setGlobalPrefix("api")
    app.use(cookieParser());


    const document = SwaggerModule.createDocument(app, config)

    const theme = new SwaggerTheme();
    const darkThemeCss = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);
    
    SwaggerModule.setup("api-docs", app, document, {
        customCss: darkThemeCss, // Apply the dark theme CSS
        customSiteTitle: 'My API Docs', // Optional: Customize site title
    })

    app.use(new DeviceMiddleware().use)
    app.useGlobalFilters(new MulterValidationExceptionFilter())
  
    app.enableCors({
      origin: (origin, callback) => {
        // const allowedOrigins : string[] = [
        //   "http://localhost:5173",
        //   "https://safira.uz",
        // ];
        // console.log(origin, "useInitil state",allowedOrigins)  
        callback(null,true);  
        // if (!origin || allowedOrigins.includes(origin)) {
        //   callback(null, true);
        // } else {
        //   callback(new Error("Not allowed by CORS"), false);
        // }
      },
      credentials: true,
  })
}

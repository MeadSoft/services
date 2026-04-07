// import {
//     AngularNodeAppEngine,
//     createNodeRequestHandler,
//     isMainModule,
//     writeResponseToNodeResponse,
// } from '@angular/ssr/node';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import { join } from 'node:path';
// import { ColorSchemes } from '@meadsoft/common-browser';

// const browserDistFolder = join(import.meta.dirname, '../browser');

// const app = express();
// app.use(cookieParser());

// // Allow OAuth popups
// app.use((_, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
//     next();
// });

// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/{*splat}', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//     express.static(browserDistFolder, {
//         maxAge: '1y',
//         index: false,
//         redirect: false,
//     }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use((req, res, next) => {
//     const cookiePrefersColorScheme = req.cookies['prefers-color-scheme'];
//     const prefersColorScheme = cookiePrefersColorScheme || ColorSchemes.Light;
//     angularApp
//         .handle(req, {
//             providers: [
//                 {
//                     provide: 'PREFERS_COLOR_SCHEME',
//                     useValue: prefersColorScheme,
//                 },
//             ],
//         })
//         .then((response) =>
//             response ? writeResponseToNodeResponse(response, res) : next(),
//         )

//         .catch(next);
// });

// /**
//  * Start the server if this module is the main entry point, or it is ran via PM2.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url) || process.env['pm_id']) {
//     const port = process.env['PORT'] || 4000;
//     app.listen(port, (error) => {
//         if (error) {
//             throw error;
//         }

//         console.log(
//             `Node Express server listening on http://localhost:${port}`,
//         );
//     });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);

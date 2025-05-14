  import { fromNodeMiddleware } from "h3";// imported this from nixt engiging to help us handle the  instance . 
  // Fixed CORS middleware (typos corrected)
  
  export default fromNodeMiddleware((req : any, res : any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });



 
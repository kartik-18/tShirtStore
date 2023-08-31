# tShirtStore

Use /api/v1 before you go on to a particular route.

Link to deployment is : https://tshirt-store-xevy.onrender.com/api/v1


Dependencies used are :- <br />
   &nbsp;&nbsp;&nbsp;&nbsp; "bcryptjs",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "cloudinary",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "cookie-parser",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"dotenv",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "express",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "express-fileupload",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"jsonwebtoken",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"mongoose",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "morgan",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "nodemailer",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "razorpay",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "stripe",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "swagger",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"swagger-ui-express",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"validator",<br />
    &nbsp;&nbsp;&nbsp;&nbsp;"yaml",<br />
   &nbsp;&nbsp;&nbsp;&nbsp; "yamljs"<br />

Roles : <br />
   &nbsp;&nbsp;&nbsp;&nbsp; Admin: Administrators hold the power to create, delete, update, and view all products within the T-shirt store. This role ensures complete   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;control over product management.<br />
  &nbsp;&nbsp;&nbsp;&nbsp; User: Users are granted the ability to view and search for products, making it easy to find and explore the T-shirt store's offerings.<br /><br /><br />

👽 These routes has middleware which mostly checks two things : firstly most of the routes are accessible only to logged in users. And &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secondly most of the GET / POST routes and all of the PUT, DELETE routes requires user to be as admin. <br /><br />

Routes :<br />

 &nbsp;&nbsp;&nbsp;&nbsp;TEST ROUTES :<br/>
 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;GET :<br/>
&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Home :- https://tshirt-store-xevy.onrender.com/api/v1/ <br/><br /><br />
   &nbsp;&nbsp;&nbsp;&nbsp; USER:<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; GET :<br />
       &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; -https://tshirt-store-xevy.onrender.com/api/v1/logout<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/userdashboard<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/users<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/manager/users<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/user/:id<br />
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; POST : <br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/signup<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/login<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/forgotPassword<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/password/reset/:id<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/password/update<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/userdashboard/update<br />
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; DELETE : <br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/user/:id<br />
     &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;PUT :<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/user/:id<br /><br /><br />
      
  &nbsp;&nbsp;&nbsp;&nbsp; PRODUCT :<br />
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; GET :<br />
      &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; -https://tshirt-store-xevy.onrender.com/api/v1/admin/products<br />
      &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; -https://tshirt-store-xevy.onrender.com/api/v1/products<br />
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; POST :<br />
      &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; -https://tshirt-store-xevy.onrender.com/api/v1/admin/product/add<br />
     &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;PUT :<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/product/:id<br />
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; DELETE :<br />
     &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/admin/product/:id<br /><br /><br />

 &nbsp;&nbsp;&nbsp;&nbsp;ORDER :<br />
  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; GET :<br />
   &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/myorder<br />
   &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/order/:id<br />
  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; POST :<br />
   &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  -https://tshirt-store-xevy.onrender.com/api/v1/order/create<br />

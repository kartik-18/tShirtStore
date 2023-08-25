const BigPromise = require("../middlewares/bigPromise");

exports.home =  BigPromise(async (req, res) => {
    // const db = await somethi()
    res.status(200).json({
      success: true,
      greeting: "Hello from home route API",
    });
  })

exports.homeDummy = (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "this is another dummy route",
  });
};


// //  BELOW IS THE PROCESS TO CODE IF WE ARE NOT USING BIGPROMISE. THAT IS TO FIRST WRAP IT IN TRY CATCH BLOCK THEN ALWAYS USE ASYNC AWAIT...
// exports.homeDummy = async (req, res) => {
//   try {
//     // const something = await something();   
//     res.status(200).json({
//       success: true,
//       greeting: "this is another dummy route",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

const express = require('express')
const router = express.Router()

const {
    signup,
    login,
    logout,
    forgotPassword,
    passwordReset,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUser,
    managerAllUser,
    admingetOneUser,
    adminUpdateOneUserDetails,
    adminDeleteOneUser,
} = require('../controllers/userController')
const { isLoggedIn ,customRole } = require('../middlewares/user')


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails) // isLoggedIn is middleware used here which also gives req.user which has been used in getLoggedInUserDetails and also in changePassword methods in user controllers
router.route('/password/update').post(isLoggedIn, changePassword)
router.route('/userdashboard/update').post(isLoggedIn, updateUserDetails)

// admmin routes
router.route('/admin/users').get(isLoggedIn,customRole('admin'), adminAllUser)

router.route('/admin/user/:id')
.get(isLoggedIn,customRole('admin'), admingetOneUser)
.put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails)
.delete(isLoggedIn,customRole('admin'),adminDeleteOneUser);

// manager routes
router.route('/manager/users').get(isLoggedIn,customRole('manager'), managerAllUser)    


module.exports = router;
const authService = require("./auth.service");
const ApiResponse = require("../../utils/api-response");
const asyncHandler = require("../../utils/async-handler");

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const tokens = await authService.login(
        email,
        password
    );

    return ApiResponse.success(
        res,
        tokens,
        "Login successful"
    );
});

module.exports = {
    login
};
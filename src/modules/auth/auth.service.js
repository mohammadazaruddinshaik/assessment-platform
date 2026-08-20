const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("./auth.repository");

const login = async (email, password) => {

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("User account is not active");
    }

    const accessToken = jwt.sign(
        {
            userId: user.id,
            organizationId: user.organizationId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        accessToken,
        refreshToken
    };
};

module.exports = {
    login
};
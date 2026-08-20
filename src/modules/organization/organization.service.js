const prisma = require("../../lib/prisma");
const bcrypt = require("bcrypt");

const organizationsRepository = require("./organization.repository");
const userRepository = require("../user/user.repository");
const roleRepository = require("../role/role.repository");
const departmentRepository = require("../department/department.repository");

const createOrganization = async (organizationData) => {

    const result = await prisma.$transaction(async (tx) => {

        const organization =
            await organizationsRepository.createOrganization(
                tx,
                {
                    name: organizationData.name,
                    displayName: organizationData.displayName,
                    description: organizationData.description,
                    email: organizationData.email,
                    phone: organizationData.phone,
                    website: organizationData.website,
                    logoUrl: organizationData.logoUrl,
                    address: organizationData.address,
                    timezone: organizationData.timezone,
                    status: organizationData.status || "ACTIVE"
                }
            );

        const ownerRole =
            await roleRepository.createRole(
                tx,
                {
                    name: "owner",
                    code: "OWNER",
                    organizationId: organization.id
                }
            );

        const headOffice =
            await departmentRepository.createDepartment(
                tx,
                {
                    departmentName: "Head Office",
                    organizationId: organization.id
                }
            );

        const hashedPassword = await bcrypt.hash(
            organizationData.owner.password,
            10
        );

        const user =
            await userRepository.createUser(
                tx,
                {
                    firstName: organizationData.owner.firstName,
                    lastName: organizationData.owner.lastName,
                    email: organizationData.owner.email,
                    phone: organizationData.owner.phone,
                    organizationId: organization.id,
                    passwordHash: hashedPassword,
                    status: "ACTIVE"
                }
            );

        await userRepository.createUserRole(
            tx,
            {
                userId: user.id,
                roleId: ownerRole.id,
                assignedByUserId: user.id
            }
        );

        await userRepository.createUserDepartment(
            tx,
            {
                userId: user.id,
                depId: headOffice.id
            }
        );

        return {
            organization,
            user
        };
    });

    delete result.user.passwordHash;

    return result;
};

const getOrganizationById = async (id) => {
    const organization = await organizationsRepository.getOrganizationById(id);
    if (!organization) {
        throw new Error("organization not found");
    }
    return organization;
};

const updateOrganization = async (id, organizationData) => {
    const organization = await organizationsRepository.updateOrganization(id, organizationData);
    if (!organization) {
        throw new Error("organization not found");
    }
    return organization;
};

const deleteOrganization = async (id) => {
    const organization = await organizationsRepository.getOrganizationById(id);
    if (!organization) {
        throw new Error("organization not found");
    }
    await organizationsRepository.deleteOrganization(id);

};

const listOrganizations = async () => {
    const organizations = await organizationsRepository.listOrganizations();
    return organizations;
}



module.exports = {
    createOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    listOrganizations
};
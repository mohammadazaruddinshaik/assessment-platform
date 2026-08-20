const prisma = require("../../lib/prisma");


const createOrganization = async (tx, data) => {

    const organization = await tx.organization.create({
        data
    });

    return organization;
};

const getOrganizationById = async (id) => {

    // const start = performance.now();

    const organization = await prisma.organization.findUnique({
        where: {
            id
        }
    });

    // console.log(
    //     `getOrganizationById DB time: ${(performance.now() - start).toFixed(2)} ms`
    // );

    return organization;
};

const updateOrganization = async (id, data) => {
    const organization = await prisma.organization.update({
        where: {
            id
        },
        data: {
            name: data.name,
            displayName: data.displayName,
            description: data.description,
            email: data.email,
            phone: data.phone,
            website: data.website,
            logoUrl: data.logoUrl,
            address: data.address,
            timezone: data.timezone,
            status: data.status
        }
    });

    return organization;
};

const deleteOrganization = async (id) => {
    await prisma.organization.delete({
        where: {
            id
        }
    });
};

const listOrganizations = async () => {
    const organizations = await prisma.organization.findMany();
    return organizations;
};

module.exports = {
    createOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    listOrganizations
};
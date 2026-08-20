const organizationService = require("./organization.service");

const ApiResponse = require("../../utils/api-response");
const asyncHandler = require("../../utils/async-handler");

const createOrganization = asyncHandler(async (req, res) => {
    const organizationData = req.body;
    const organization = await organizationService.createOrganization(organizationData);
    return ApiResponse.created(
        res,    
        organization,
        "Organization created successfully"
    );
});

const getOrganizationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organization = await organizationService.getOrganizationById(id);
    return ApiResponse.success(
        res,
        organization,
        "Organization fetched successfully"
    );
});

const updateOrganization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationData = req.body;
    const updatedOrganization = await organizationService.updateOrganization(id, organizationData);
    return ApiResponse.success(
        res,
        updatedOrganization,
        "Organization updated successfully"
    );
});

const deleteOrganization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await organizationService.deleteOrganization(id);
    return ApiResponse.success(
        res,
        null,
        "Organization deleted successfully"
    );  

});

const listOrganization = asyncHandler(async (req, res) => {
    const organizations = await organizationService.listOrganizations();
    return ApiResponse.success(
        res,
        organizations,
        "Organizations fetched successfully"
    );
});

module.exports = {
    createOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    listOrganization
};
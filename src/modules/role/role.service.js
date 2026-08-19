const express = require('express');
const router = express.Router();

const rolerepository = require('./role.repository');



const createRole = async (roleData) => {

    const newrolepayload = {
        name: roleData.name,
        description: roleData.description,
        codec: roleData.code
    }

    const createdRole = await rolerepository.createRole(newrolepayload);

    delete createdRole.permissions; // Remove permissions from the response

    return createdRole;
};

const deleteRole = async (roleData) => {

    const existingRole = await rolerepository.getRoleById(roleData.id);
    if (!existingRole) {
        throw new Error('Role not found');
    }
    await rolerepository.deleteRole(roleData.id);

};

const getRoleById = async (roleData) => {
    const existingRole = await rolerepository.getRoleById(roleData.id);
    if (!existingRole) {
        throw new Error('Role not found');
    }
    return existingRole;
};

const updateRole = async (roleData) => {
    const existingRole = await rolerepository.getRoleById(roleData.id);
    if (!existingRole) {
        throw new Error('Role not found');
    }
    const updatedRole = await rolerepository.updateRole(roleData.id, roleData);
    return updatedRole;
};  

const listRoles = async () => {
    const roles = await rolerepository.listRoles();
    return roles;
};

module.exports = {
    
    createRole,
    deleteRole,
    getRoleById,
    updateRole,
    listRoles
};
import maintenanceService from "../services/maintenance.service.js";

export const createMaintenance = async (req, res) => {
    try {

        const maintenance = await maintenanceService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Maintenance request created successfully",
            data: maintenance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllMaintenance = async (req, res) => {
    try {

        const maintenance = await maintenanceService.getAll(req.query);

        return res.status(200).json({
            success: true,
            data: maintenance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getMaintenanceById = async (req, res) => {
    try {

        const maintenance = await maintenanceService.getById(req.params.id);

        return res.status(200).json({
            success: true,
            data: maintenance
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

export const updateMaintenance = async (req, res) => {
    try {

        const maintenance = await maintenanceService.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance updated successfully",
            data: maintenance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteMaintenance = async (req, res) => {
    try {

        await maintenanceService.delete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Maintenance deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const approveMaintenance = async (req, res) => {
    try {

        const maintenance = await maintenanceService.approve(
            req.params.id,
            req.body.approvedBy
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance approved successfully",
            data: maintenance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const resolveMaintenance = async (req, res) => {
    try {

        const maintenance = await maintenanceService.resolve(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance resolved successfully",
            data: maintenance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
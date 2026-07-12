import MaintenanceRequest from "../models/MaintenanceRequest.js";
import ActivityLog from "../models/ActivityLog.js";

class MaintenanceService {

    async create(data) {

        const maintenance = await MaintenanceRequest.create({
            asset: data.asset,
            requestedBy: data.requestedBy,
            technician: data.technician,
            priority: data.priority,
            issueDescription: data.issueDescription,
            estimatedCost: data.estimatedCost
        });

        await ActivityLog.create({
            user: data.requestedBy,
            module: "MAINTENANCE",
            action: "CREATE",
            entityId: maintenance._id,
            description: `Maintenance Request ${maintenance.maintenanceCode} Created`
        });

        return maintenance;

    }

    async getAll(query) {

        const page = Number(query.page) || 1;

        const limit = Number(query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {};

        if (query.status) {

            filter.status = query.status;

        }

        if (query.priority) {

            filter.priority = query.priority;

        }

        const maintenance = await MaintenanceRequest.find(filter)

            .populate("asset")

            .populate("requestedBy", "firstName lastName employeeCode")

            .populate("approvedBy", "firstName lastName employeeCode")

            .sort({ createdAt: -1 })

            .skip(skip)

            .limit(limit);

        const total = await MaintenanceRequest.countDocuments(filter);

        return {

            total,

            page,

            totalPages: Math.ceil(total / limit),

            maintenance

        };

    }

    async getById(id) {

        const maintenance = await MaintenanceRequest.findById(id)

            .populate("asset")

            .populate("requestedBy")

            .populate("approvedBy");

        if (!maintenance) {

            throw new Error("Maintenance Request Not Found");

        }

        return maintenance;

    }

    async update(id, data) {

        const maintenance = await MaintenanceRequest.findById(id);

        if (!maintenance) {

            throw new Error("Maintenance Request Not Found");

        }

        maintenance.technician = data.technician ?? maintenance.technician;

        maintenance.priority = data.priority ?? maintenance.priority;

        maintenance.issueDescription = data.issueDescription ?? maintenance.issueDescription;

        maintenance.estimatedCost = data.estimatedCost ?? maintenance.estimatedCost;

        maintenance.actualCost = data.actualCost ?? maintenance.actualCost;

        maintenance.resolution = data.resolution ?? maintenance.resolution;

        maintenance.status = data.status ?? maintenance.status;

        if (data.status === "RESOLVED") {

            maintenance.resolvedAt = new Date();

        }

        await maintenance.save();

        await ActivityLog.create({

            user: maintenance.requestedBy,

            module: "MAINTENANCE",

            action: "UPDATE",

            entityId: maintenance._id,

            description: `Maintenance Request ${maintenance.maintenanceCode} Updated`

        });

        return maintenance;

    }

    async delete(id) {

        const maintenance = await MaintenanceRequest.findById(id);

        if (!maintenance) {

            throw new Error("Maintenance Request Not Found");

        }

        await ActivityLog.create({

            user: maintenance.requestedBy,

            module: "MAINTENANCE",

            action: "DELETE",

            entityId: maintenance._id,

            description: `Maintenance Request ${maintenance.maintenanceCode} Deleted`

        });

        await maintenance.deleteOne();

        return;

    }

    async approve(id, approvedBy) {

        const maintenance = await MaintenanceRequest.findById(id);

        if (!maintenance) {

            throw new Error("Maintenance Request Not Found");

        }

        maintenance.status = "APPROVED";

        maintenance.approvedBy = approvedBy;

        await maintenance.save();

        await ActivityLog.create({

            user: approvedBy,

            module: "MAINTENANCE",

            action: "APPROVE",

            entityId: maintenance._id,

            description: `Maintenance Request ${maintenance.maintenanceCode} Approved`

        });

        return maintenance;

    }

    async resolve(id, data) {

        const maintenance = await MaintenanceRequest.findById(id);

        if (!maintenance) {

            throw new Error("Maintenance Request Not Found");

        }

        maintenance.status = "RESOLVED";

        maintenance.actualCost = data.actualCost;

        maintenance.resolution = data.resolution;

        maintenance.resolvedAt = new Date();

        await maintenance.save();

        await ActivityLog.create({

            user: maintenance.requestedBy,

            module: "MAINTENANCE",

            action: "RESOLVE",

            entityId: maintenance._id,

            description: `Maintenance Request ${maintenance.maintenanceCode} Resolved`

        });

        return maintenance;

    }

}

export default new MaintenanceService();
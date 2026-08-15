const getPagination = (query) => {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(Number.parseInt(query.limit, 10) || 20, 1),
        100
    );

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};

const getPaginationMeta = (page, limit, total) => {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

module.exports = {
    getPagination,
    getPaginationMeta
};
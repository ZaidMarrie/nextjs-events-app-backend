"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Create event with linked user
  async create(ctx) {
    const { id } = ctx.state.user;

    const response = await super.create(ctx);
    const updatedResponse = await strapi.entityService.update(
      "api::event.event",
      response.data.id,
      { data: { user: id } }
    );

    return updatedResponse;
  },

  // Update user event
  async update(ctx) {
    const { id: paramsId } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: paramsId,
        user: userId,
      },
    });

    if (event) {
      const response = await super.update(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  // Delete user event
  async delete(ctx) {
    const { id: paramsId } = ctx.request.params;
    const { id: userId } = ctx.state.user;

    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: paramsId,
        user: userId,
      },
    });

    if (event) {
      const response = await super.delete(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  // Find with populate
  async find(ctx) {
    const populateList = ["user", "image"];

    // Push any additional query params to the array
    populateList.push(ctx.query.populate);

    const { query } = ctx;
    ctx.query = { ...query, populate: populateList.join(",") };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Find One with populate
  async findOne(ctx) {
    const populateList = ["user", "image"];

    // Push any additional query params to the array
    populateList.push(ctx.query.populate);

    const { query } = ctx;
    ctx.query = { ...query, populate: populateList.join(",") };

    const response = await super.findOne(ctx);
    return response;
  },

  // Get logged in user
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      ctx.badRequest(null, [
        {
          messages: [{ id: "No Authorization header was found" }],
        },
      ]);
    }

    const entity = await strapi.db.query("api::event.event").findMany({
      where: {
        user: { id: user.id },
      },
      populate: {
        user: true,
        image: true,
      },
    });

    if (!entity) {
      ctx.notFound();
    }

    return await this.sanitizeOutput(entity, ctx);
  },
}));

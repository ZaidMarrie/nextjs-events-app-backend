const slugify = require("slugify");

module.exports = {
  beforeCreate: async (event) => {
    const { data } = event.params;

    if (data.name) {
      data.slug = slugify(data.name, { lower: true });
    }
  },
  beforeUpdate: async (params, event) => {
    const { data } = event.params;

    if (data.name) {
      data.slug = slugify(data.name, { lower: true });
    }
  },
};

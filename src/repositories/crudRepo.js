export default function crudRepo(model) {
  return {
    model: model,
    create: async function (data) {
      const created = await this.model.create(data)
      return created
    },
    getAll: async function () {
      const allDocs = await this.model.find()
      return allDocs
    },
    getById: async function (id) {
      const doc = await this.model.findById(id)
      return doc
    },
    update: async function (id, data) {
      const updatedDoc = await this.model.findByIdAndUpdate(id, data, {
        new: true
      })
      return updatedDoc
    },
    delete: async function (id) {
      const deletedDoc = await this.model.findByIdAndDelete(id)
      return deletedDoc
    },
    getDocPaginated: async function (page = 1, limit = 10) {
      const docs = await this.model
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      return docs
    },
    deleteManyByIds: async function (idsArray = []) {
      const response = this.model.deleteMany({
        _id: {
          $in: idsArray
        }
      })
      return response
    }
  }
}

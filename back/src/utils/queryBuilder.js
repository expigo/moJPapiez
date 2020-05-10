module.exports = class {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
    // console.group('queryBuilder')
    // console.log(this.query)
    // console.log(this.queryString)
    // console.groupEnd('queryBuilder')
  }

  sanitize() {
    if (Object.keys(this.queryString).length != 0) {
      console.log('yo')
      const queryObj = {...this.queryString}
      const excludeFields = ['fields', 'limit', 'page', 'sort']
      excludeFields.forEach(f => delete queryObj[f])

      const filteredQueryString = JSON.stringify(queryObj).replace(
        /\b(gte|gt|lte|lt)\b/g,
        match => `$${match}`
      )

      this.query = this.query.find(JSON.parse(filteredQueryString))
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  paginate() {
    const page = +this.queryString.page || 1
    const limit = +this.queryString.limit || 10

    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(+limit)

    // console.log('paginiate', this.query)
    return this
  }

  sort() {
    let {sort} = this.queryString
    if (sort) {
      sort = sort.split(',').join(' ')
      this.query.sort(sort)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  build() {
    // console.log(this.query)
    return this.query
  }
}

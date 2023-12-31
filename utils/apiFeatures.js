class APIFeatures {
  constructor(query, queryString) {
    this.query = query;

    this.queryString = queryString;
    this.metadata = {
      totalItems: 0,
      totalPage: 0,
      currentPage: 0,
    };
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

    search() {
      if (this.queryString.search) {
        const search = this.queryString.search;
        this.query = this.query.find({ $text: {$search: "\""+search+"\""} });
      }
      return this;
    }

    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if(this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v'); 
      }
      return this;
    }
  
    paginate() {
      // page: 3, limit: 12
      // 0..11, 12..23, 24..35
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async getMetadata() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const count = await this.query.countDocuments({ deleted: false });
    this.metadata = {
      ...this.metadata,
      totalItems: count,
      totalPage: Math.ceil(count / limit),
      currentPage: page * 1 || 1,
    };
    return this;
  }
}

module.exports = APIFeatures;

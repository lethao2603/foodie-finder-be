const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (result, page, limit) => {
  // const { count: totalItems, rows: data } = result;
  const currentPage = page ? +page : 0;
  // const totalPages = Math.ceil(totalItems / limit);

  return { result, currentPage, limit };
};
module.exports = {getPagination, getPagingData}
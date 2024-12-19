
export function generatePaginationInfo(total_count:number, limit:number, page:number) {
    const total_pages = Math.ceil(total_count / limit);
    const has_last_page = page > 1;
    const has_next_page = page < total_count && total_count > limit;
    let metadata = {
      total_count,
      total_pages,
      has_last_page,
      has_next_page,
    };
    console.log(metadata);
    return metadata;
  }
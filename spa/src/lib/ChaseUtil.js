const CHASE_S3_BASE_URL = 'https://s3.amazonaws.com/syon-chase';

function getDate(time10) {
  const dt = new Date(time10 * 1000);
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  return `${y}.${m}.${d}`;
}

function moldRawItem(pocketRawItem) {
  const m = pocketRawItem;
  const url = m.resolved_url ? m.resolved_url : m.given_url;
  const title = m.resolved_title ? m.resolved_title : m.given_title;
  const item10Id = `0000000000${m.item_id}`.substr(-10, 10);
  const itemId3 = item10Id.slice(0, 3);
  const s3path = `items/thumbs/${itemId3}/${item10Id}.jpg`;
  return {
    eid: m.item_id,
    url,
    image_suggested: (m.has_image === '1') ? m.image.src : '',
    image_s3_url: `${CHASE_S3_BASE_URL}/${s3path}`,
    title,
    excerpt: m.excerpt,
    fqdn: `${url}/`.match(/\/\/(.*?)\//)[1],
    sortId: m.sort_id,
    tags: m.tags || {},
    date: getDate(m.time_added),
  };
}

function makeEntries(listFromPocket) {
  const newEntries = {};
  Object.keys(listFromPocket).forEach((key) => {
    newEntries[key] = moldRawItem(listFromPocket[key]);
  });
  return newEntries;
}

export default {
  makeEntries,
};

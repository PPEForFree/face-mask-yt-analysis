const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const API_KEY = ""; // add API Key Here

const indexWriter = createCsvWriter({
  path: `data/index.csv`,
  header: [
    "index",
    "id",
    "url",
    "title",
    "lengthText",
    "length",
    "views",
    "published",
  ],
});

const chunkArrayInGroups = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const scrapeHTML = () => {
  const html = fs.readFileSync(path.resolve(__dirname, "data/a.html"), "utf8");
  const $ = cheerio.load(html);
  const array = [];
  $(".ytd-item-section-renderer").map((index, el) => {
    const url = "https://youtube.com" + $(el).find("#video-title").attr("href");
    const id = new URL(url).searchParams.get("v");
    const title = $(el).find("#video-title").text().trim();
    const lengthText = $(el)
      .find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer")
      .text()
      .trim();
    const length =
      Number(lengthText.split(":")[0]) + Number(lengthText.split(":")[1]) / 60;
    const meta = $(el)
      .find("#metadata-line")
      .text()
      .split(`\n`)
      .map((s) => s.trim())
      .filter((s) => s.length);
    const views = meta[0].replace(" views", "");
    const published = meta[1];
    array.push({
      index,
      id,
      url,
      title,
      lengthText,
      length,
      views,
      published,
    });
  });
  return array;
};

const search = async (term) =>
  axios.get(
    `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      term
    )}&type=video&key=${API_KEY}`
  );

const get = async (ids) =>
  axios.get(
    `https://content.googleapis.com/youtube/v3/videos?&part=statistics%2Csnippet%2CtopicDetails%2Clocalizations&key=${API_KEY}&id=${encodeURIComponent(
      ids.toString()
    )}`
  );

const saveChunked = async (ids) => {
  const chunks = chunkArrayInGroups(ids, 50);
  for (let index = 0; index < chunks.length; index++) {
    try {
      await sleep(200);
      const chunk = chunks[index];
      const { data } = await get(chunk);
      fs.writeFileSync(
        `data/chunk-${index}.json`,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  }
};

const saveIndex = () => {
  const array = scrapeHTML();
  console.log(array);
  indexWriter.writeRecords(array);
};

const saveDetails = async () => {
  const array = genIndex();
  await saveChunked(array.map((item) => item.id));
};

/* (async () => {
  const { data } = await search(
    "DIY+face+mask|make+face+mask|sew+face+mask|home+face+mask"
  );
  console.log(JSON.stringify(data, null, 2));
})();
 */

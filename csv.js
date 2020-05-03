const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const details = () => {
  const writer = createCsvWriter({
    path: `data/details.csv`,
    header: [
      "id",
      "publishedAt",
      "channelID",
      "channelTitle",
      "categoryID",
      "defaultAudioLanguage",
      "defaultLanguage",
      "viewCount",
      "commentCount",
      "likeCount",
      "dislikeCount",
      "favoriteCount",
    ],
  });
  const array = [];
  for (let index = 0; index < 11; index++) {
    const chunk = require(`./data/details-${index}.json`);
    array.push(
      ...chunk.items.map((item) => {
        return {
          id: item.id,
          publishedAt: item.snippet.publishedAt,
          // title: item.snippet.title,
          // description: item.snippet.description,
          channelID: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          categoryID: item.snippet.categoryId,
          defaultAudioLanguage: item.snippet.defaultAudioLanguage,
          defaultLanguage: item.snippet.defaultLanguage,
          viewCount: Number(item.statistics.viewCount),
          commentCount: Number(item.statistics.commentCount),
          likeCount: Number(item.statistics.likeCount),
          dislikeCount: Number(item.statistics.dislikeCount),
          favoriteCount: Number(item.statistics.favoriteCount),
        };
      })
    );
  }
  writer.writeRecords(array);
};

details();

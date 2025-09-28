// .eleventy.js  (Eleventy v3.x)
module.exports = function(eleventyConfig) {
  // 静态资源（若你用了 /src/img）
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  // ===== 日期过滤器 =====
  const { DateTime } = require("luxon");

  // 兼容你在模板里用到的 | date
  // 用法：{{ someDate | date("yyyy-LL-dd") }}
  eleventyConfig.addFilter("date", (dateObj, fmt = "yyyy-LL-dd") => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(fmt);
  });

  // 你在 blog.md 里用到的 | dateFormat
  eleventyConfig.addFilter("dateFormat", (dateObj, fmt = "yyyy-LL-dd") => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(fmt);
  });

  // ===== 文章集合：只取 tags:["posts"] 且 reading:true，按日期倒序 =====
  eleventyConfig.addCollection("blogDesc", (collectionApi) => {
    return collectionApi.getFilteredByTag("posts")
      .filter(item => item.data && item.data.reading === true && item.data.draft !== true)
      .sort((a, b) => b.date - a.date); // 新→旧
  });

  // Current year shortcode for footer
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());  

  eleventyConfig.addCollection("essayDesc", (api) =>
  api.getFilteredByTag("essay").sort((a, b) => b.date - a.date)
  );

  // 目录与模板引擎（v3 用返回对象）
  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
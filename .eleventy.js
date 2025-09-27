// .eleventy.js
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // 静态资源直出
  eleventyConfig.addPassthroughCopy("src/assets");

  // 文章集合
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  // --- 日期工具 ---
  function toDate(input) {
    if (!input) return null;
    if (input instanceof Date) return input;
    if (typeof input === "number") return new Date(input); // 时间戳
    if (typeof input === "string") {
      if (input.toLowerCase() === "now") return new Date();
      const iso = DateTime.fromISO(input);
      if (iso.isValid) return iso.toJSDate();
    }
    return null;
  }

  function formatDate(input, fmt = "yyyy-LL-dd") {
    const jsDate = toDate(input);
    if (!jsDate) return "";
    return DateTime.fromJSDate(jsDate).toFormat(fmt);
  }

  // 统一注册（Eleventy v2/v3 都吃）
  eleventyConfig.addFilter("date", formatDate);
  eleventyConfig.addFilter("dateFormat", formatDate);
  // 兼容旧 API（不报错就好）
  if (eleventyConfig.addNunjucksFilter) {
    eleventyConfig.addNunjucksFilter("date", formatDate);
    eleventyConfig.addNunjucksFilter("dateFormat", formatDate);
  }

  // 年份 shortcode
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // templateFormats: ["njk", "md", "html"], // 可选
  };
};
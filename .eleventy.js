const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // 静态资源
  eleventyConfig.addPassthroughCopy("src/assets");

  // 博客集合（按时间倒序）
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  // ✅ 自定义 Nunjucks 过滤器：dateFormat
  eleventyConfig.addNunjucksFilter("dateFormat", (dateObj, fmt = "yyyy-LL-dd") => {
    if (!dateObj) return "";
    // 统一用本地时区或改成 { zone: "utc" }
    return DateTime.fromJSDate(dateObj).toFormat(fmt);
  });

  // ✅ 年份短代码：模板里用 {{ year() }}
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
---
layout: layouts/base.njk
title: 首页
---

# 欢迎
这是我的个人网站：分享经验、博客文章、还有书架。



## 最新文章
{% for post in collections.posts | slice(0,3) %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | dateFormat("yyyy-LL-dd") }})
{% endfor %}

[查看全部文章 →](/blog)
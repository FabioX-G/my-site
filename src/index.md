---
layout: layouts/base.njk
title: Home
home: true
---

<div class="hero-intro">
  <div class="hero-avatar">
    <img src="/assets/fabio-photo.png" alt="Portrait of Fabio Xie" decoding="async" loading="lazy" />
  </div>
  <div class="hero-copy">
    <h1>Fabio Xie</h1>
    <p>Building at <a href="https://www.amora-vida.com/">Amora Vida</a> in Portugal.</p>
    <p><a href="/about/">Read my bio →</a></p>
  </div>
</div>

<p>I split my time between building product, sharpening my judgment through <a href="/essays/">essays</a>, and collecting ideas (through <a href="/bookshelf/">reading</a> and <a href="https://youtube.com/playlist?list=PLj16FroKy8w9ZVWMyARY8ckgfOXrGo9Dn&amp;si=EO1yRSOArpazXr53" target="_blank" rel="noopener noreferrer">talking</a>) that make me better at both.</p>

{% set latestEssays = collections.essayLatest or collections.essayDesc %}
{% if latestEssays and latestEssays.length %}
## Latest Essays
<ul class="blog-list blog-list--compact">
{% for post in latestEssays %}
  <li>
    <a class="blog-link" href="{{ post.url }}">{{ post.data.title }}</a>
    <span class="blog-meta">{{ post.date | date('yyyy-LL-dd') }}</span>
  </li>
{% endfor %}
</ul>
{% endif %}

{% if collections.insights and collections.insights.length %}
## Latest Insights
<ul class="blog-list blog-list--compact">
{% for it in collections.insights | slice(0,3) %}
  <li>
    <a class="blog-link" href="{{ it.url }}">{{ it.data.title }}</a>
    <span class="blog-meta">{{ it.date | date('yyyy-LL-dd') }}</span>
  </li>
{% endfor %}
</ul>
{% endif %}

<div class="contact-links" aria-label="Ways to reach me">
  <a class="contact-chip" href="mailto:fabio@amora-vida.com">Email</a>
  <a class="contact-chip" href="https://www.youtube.com/@fabio_xie" target="_blank" rel="noopener noreferrer">YouTube</a>
  <a class="contact-chip" href="https://www.linkedin.com/in/fabio-x-871364176/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
</div>

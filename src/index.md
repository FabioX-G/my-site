---
layout: layouts/base.njk
title: Home
home: true
---

# Welcome to my site!

<div class="hero-intro">
  <div class="hero-avatar">
    <img src="/assets/fabio-photo.png" alt="Portrait of Fabio Xie" decoding="async" loading="lazy" />
  </div>
  <div class="hero-copy">
    <p>This is Fabio.</p>
    <p>Born in Lisbon 🇵🇹, grew up in Shanghai 🇨🇳, studied at Syracuse University 🇺🇸, lived in Thailand 🇹🇭 for a while, and now I’m back in Portugal to work at <strong><a href="https://www.amora-vida.com/">Amora Vida</a></strong>. (More <a href="/about/">about me</a>)</p>
    <p>I share my <a href="/essay/">essays</a> here from time to time to think and reflect.</p>
  </div>
</div>

In my free time, I enjoy reading nonfiction <a href="/bookshelf/">books</a>, training <a href="https://youtu.be/b-5bljm8tSk">Muay Thai</a>, playing soccer, <a href="https://youtu.be/034gmmUK8vc">interviewing</a> friends, vibe-coding this personal website of mine, and spending time with my 10-year-old brother <a href="https://youtu.be/dF_8LnEW9QU?si=Wl7bBf9lCH_KhuzK">Jason</a> (we play Brawl Stars & FC Mobile, brainstorm about his new novels, and read comic books before bedtime).


## Latest Essays
{% for post in collections.essay | sort(attribute='date') | reverse %}
  {% if loop.index0 < 3 %}
- [{{ post.data.title }}]({{ post.url }}) ({{ post.date | date('yyyy-LL-dd') }})
  {% endif %}
{% endfor %}



<p class="home-cta">
  · <a href="/essay/">See all essays →</a> 
  · <a href="/bookshelf/">My bookshelf →</a>
  · <a href="/quotes/">Quotes →</a>
</p>

<div class="contact-links" aria-label="Ways to reach me">
  <a class="contact-chip" href="mailto:fabio@amora-vida.com">Email</a>
  <a class="contact-chip" href="https://www.youtube.com/@fabio_xie" target="_blank" rel="noopener noreferrer">YouTube</a>
  <a class="contact-chip" href="https://www.linkedin.com/in/fabio-xie" target="_blank" rel="noopener noreferrer">LinkedIn</a>
</div>

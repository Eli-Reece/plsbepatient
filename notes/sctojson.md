+++
date = '2024-12-11T21:32:16-08:00'
draft = true
title = 'Sctojson'
+++

## Run in console on a soundcloud page with a playlist
```js
copy([...document.querySelectorAll('.trackItem__content')].map(ele => {return ({'artist' : ele.querySelectorAll('a')[0].innerHTML, 'track' : ele.querySelectorAll('a')[1].innerHTML, 'url' : ele.querySelectorAll('a')[1].href})}))
```
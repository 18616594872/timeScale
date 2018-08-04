# timeScale

Used for conversion between scale and time.

## Quick start

include the files

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.timeScale.js"></script>
```

call the the plugin on a container as your wish
```js
$('.demoDiv').timeScale();
```
All done!


## Options


you can custom the caption by passing options when call the plugin, all available options are listed below.

```js
$('.demoDiv').timeScale({
      option1:option1,
      option2:option2,
      ...
});
```

| Option          | type          | default          | Description                                      |
|-----------------|---------------|------------------|--------------------------------------------------|
| height          | string        | `'27px'`            | Time scale height|
| width          | string        | `'570px'`            | Time scale width.|
| background         | string        | `'linear-gradient(to right,#434d5a 0,#00c7d7 50%,#434d5a 100%)'`          | Progress background color ,Support the gradient     |
| showTimeTop        | string | `'31px'`           |  Time frame distance time scale height             |
| showTimeBgColor       | string        | `'#fff'`           | Time frame background color         |
| defaultTime | string        | `'09:00-18:00'` | Default time, the scale used to convert time            |


## Compatibility

* Requirs jQuery 1.7+
* Works well with all modern browsers and IE9+.


![](https://raw.githubusercontent.com/wiki/1960492759@qq.com/timeScale/timeScale.gif)

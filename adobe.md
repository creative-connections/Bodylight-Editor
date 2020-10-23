### Animate objects exported from Adobe Animate 
This objects uses createJS library in order to control animation

**`bdl-animate-adobe`** renders the exporeted animation into the place

```xml
<bdl-animate-adobe 
    src="ZelezoCelek.js" 
    width="800"
    height="600"
    name="ZelezoCelek"
    fromid="id4" ></bdl-animate-adobe> 
``` 
* `src` - exported JS file from Adobe Animate
* `width` - width of the canvas (default 800px)
* `height` - height of the canvas (default 600px)
* `name` - name of the object exported in JS 
* `fromid` - component giving the data to animate.

**`bdl-animate-adobe-control`** displays play/stop and step button in order to control reffered animation.
Sends custom events `animatestart` and `animatestop`. The target elements should listen these events, usually by specifying `fromid`.
```xml
<bdl-animate-adobe-control
   id="id4"></bdl-animate-adobe-control>
   
```
** `bdl-bind2a` ** defines binding between FMU simulation variable and animation object value
* `findex` index of variable in fmu array
* `aname` name of animation component in AA (can go deep using dot `.` notation, see example bellow)
* `amin` (default = 0) minimal value in animate component
* `amax` (default = 100) maximal value in animate component
* `fmin` (default = 0) minimal value of variable from fmu model to be animated
* `fmax` (default = 100) maximal value of variable from fmu model to be animated
The conversion is made as linear approximation between amin and amax as following:
* $x<f_{min} \Rightarrow a_{min}$ 
* $f_{min} < x < f_{max} \Rightarrow a_{min} + \frac{(x-f_{min})(a_{max}-a_{min}}{f_{max}-f_{min}}$
* $f_{max} < x \Rightarrow a_{max}$

```xml
<bdl-bind2a findex="0" aname="ventricles.ventriclesTotal.VentricleLeft_anim" amin="100" amax="0" fmin="0.00007" fmax="0.00015"></bdl-bind2a>
<bdl-bind2a findex="6" aname="ValveMV_anim" amin="99" amax="0" fmin="0" fmax="1"></bdl-bind2a>
<bdl-bind2a findex="7" aname="ValveAOV_anim" amin="0" amax="99" fmin="0" fmax="1"></bdl-bind2a>
<bdl-bind2a findex="14" aname="ValveTV_anim" amin="99" amax="0" fmin="0" fmax="1"></bdl-bind2a>
<bdl-bind2a findex="15" aname="ValvePV_anim" amin="0" amax="99" fmin="0" fmax="1"></bdl-bind2a>

```

Example:

<bdl-animate-adobe-control id="id4"></bdl-animate-adobe-control>
    
<bdl-animate-adobe 
    src="ZelezoCelek.js" 
    width="800"
    height="600"
    name="ZelezoCelek"
    fromid="id4" ></bdl-animate-adobe>

    
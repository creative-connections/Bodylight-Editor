# BDL-buttonparams

button to set multiple values in one click, these attributes, if it doesn't exist, creates input with id from ids list, if the input exist, e.g. from previous <range> then this will be changed.
* title - text to be on the button
* ids - comma separated list of unique ids referenced by fmi - e.g. 'id1,id2,id3'
* values - comma separated list of values to be set to variables if button is pressed - e.g. '120,60,10'

Example:
```
<bdl-buttonparams title="pathology" ids="id1" values="40"></bdl-buttonparams>
<bdl-buttonparams title="normal" ids="id1" values="80"></bdl-buttonparams>

```
